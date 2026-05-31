import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.1';

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: cors() });
  if (req.method !== 'POST') {
    return json({ error: { code: 'METHOD_NOT_ALLOWED', message: 'POST only' } }, 405);
  }

  const deviceId = req.headers.get('X-Device-Id');
  if (!deviceId) {
    return json({ error: { code: 'DEVICE_ID_REQUIRED', message: 'Missing X-Device-Id' } }, 401);
  }

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return json({ error: { code: 'VALIDATION_ERROR', message: 'Invalid JSON' } }, 400);
  }

  const prompt = String(body.prompt ?? '').trim();
  const transcript = String(body.transcript ?? '').trim();
  if (!prompt || !transcript) {
    return json({ error: { code: 'VALIDATION_ERROR', message: 'prompt and transcript required' } }, 400);
  }

  const matchScore = similarityScore(prompt, transcript);
  const feedback = pronunciationFeedback(matchScore);
  const supabase = adminClient();

  const { data: sessionRow, error: sessErr } = await supabase
    .from('speech_sessions')
    .insert({
      device_id: deviceId,
      prompt,
      transcript,
      score: matchScore,
    })
    .select('id')
    .single();

  if (sessErr) {
    console.error('speech_sessions insert', sessErr);
    return json({
      matchScore,
      score: matchScore,
      feedback,
      persisted: false,
    });
  }

  const sessionId = sessionRow.id as string;
  const word = prompt.split(/\s+/)[0] ?? 'phrase';
  await supabase.from('pronunciation_scores').insert({
    device_id: deviceId,
    session_id: sessionId,
    word,
    score: matchScore,
    feedback,
  });

  return json({
    sessionId,
    matchScore,
    score: matchScore,
    feedback,
    persisted: true,
  });
});

function similarityScore(expected: string, actual: string): number {
  const a = normalize(expected);
  const b = normalize(actual);
  if (!a.length) return 0;
  if (a === b) return 100;
  const aWords = a.split(' ');
  const bWords = new Set(b.split(' '));
  let hits = 0;
  for (const w of aWords) {
    if (bWords.has(w)) hits += 1;
  }
  return Math.round((hits / aWords.length) * 100);
}

function normalize(s: string): string {
  return s.toLowerCase().replace(/[^\w\s]/g, '').trim();
}

function pronunciationFeedback(score: number): string {
  if (score >= 90) return 'Xuất sắc — phát âm rất gần mẫu.';
  if (score >= 70) return 'Khá tốt — luyện thêm trọng âm và nhịp.';
  if (score >= 50) return 'Cần cải thiện — thử nói chậm và rõ hơn.';
  return 'Hãy nghe lại mẫu và thử lại từng cụm từ.';
}

function adminClient() {
  return createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!);
}

function cors() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers':
      'authorization, x-client-info, apikey, content-type, x-device-id',
  };
}

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...cors(), 'Content-Type': 'application/json' },
  });
}
