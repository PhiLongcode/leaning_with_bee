/**
 * FN-17 vocab-enrich — smoke load (dev/staging only).
 * Env: PERF_SUPABASE_URL, PERF_SUPABASE_ANON_KEY (publishable hoặc JWT eyJ...)
 * Auth: anonymous signup → access_token (publishable key không gửi thẳng Edge được).
 */
import http from 'k6/http';
import { check, sleep } from 'k6';

const baseUrl = (__ENV.PERF_SUPABASE_URL || '').replace(/\/$/, '');
const anonKey = __ENV.PERF_SUPABASE_ANON_KEY || '';
const vus = Number(__ENV.PERF_VUS || 2);
const duration = __ENV.PERF_DURATION || '30s';
const p95MaxMs = Number(__ENV.PERF_P95_MS || 2000);

export const options = {
  scenarios: {
    smoke: {
      executor: 'constant-vus',
      vus,
      duration,
    },
  },
  thresholds: {
    http_req_duration: [`p(95)<${p95MaxMs}`],
    http_req_failed: ['rate<0.05'],
    checks: ['rate>0.95'],
  },
};

export function setup() {
  if (!baseUrl || !anonKey) {
    throw new Error('Set PERF_SUPABASE_URL and PERF_SUPABASE_ANON_KEY');
  }

  if (anonKey.startsWith('eyJ')) {
    return { accessToken: anonKey };
  }

  const signup = http.post(
    `${baseUrl}/auth/v1/signup`,
    JSON.stringify({}),
    {
      headers: {
        'Content-Type': 'application/json',
        apikey: anonKey,
        Authorization: `Bearer ${anonKey}`,
      },
    },
  );

  if (signup.status !== 200) {
    throw new Error(`auth signup failed: ${signup.status} ${signup.body}`);
  }

  const token = signup.json('access_token');
  if (!token) {
    throw new Error('auth signup missing access_token');
  }

  return { accessToken: token };
}

export default function vocabEnrichSmoke(data) {
  const accessToken = data?.accessToken;
  if (!accessToken) return;

  const url = `${baseUrl}/functions/v1/vocab-enrich`;
  const payload = JSON.stringify({
    mode: 'full',
    word: 'deploy',
    native_language: 'vi',
    topic: 'Release',
  });

  const res = http.post(url, payload, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
      apikey: anonKey,
      'X-Device-Id': `k6-vu-${__VU}-iter-${__ITER}`,
    },
    tags: { name: 'vocab-enrich' },
  });

  check(res, {
    'status 200': (r) => r.status === 200,
    'has dialogue': (r) => {
      try {
        const body = r.json();
        return Array.isArray(body?.dialogue?.lines) && body.dialogue.lines.length >= 2;
      } catch {
        return false;
      }
    },
  });

  sleep(0.3);
}
