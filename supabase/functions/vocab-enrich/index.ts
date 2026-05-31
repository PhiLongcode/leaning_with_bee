import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';

type DialogueLine = { speaker: string; text: string };
type Dialogue = { scenario?: string; workplaceRole?: string; lines: DialogueLine[] };
type ExplanationNative = {
  language: string;
  summary: string;
  usageInContext: string;
  grammarNotes?: string;
};

type EnrichRequest = {
  mode: 'full' | 'enrich';
  word: string;
  meaning?: string | null;
  context?: string | null;
  example?: string | null;
  topic?: string | null;
  workplace_roles?: string[];
  native_language?: string;
};

const RATE_LIMIT = Number(Deno.env.get('VOCAB_ENRICH_RATE_LIMIT') ?? '30');
const rateMap = new Map<string, { count: number; resetAt: number }>();

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: cors() });
  }
  if (req.method !== 'POST') {
    return json({ error: { code: 'METHOD_NOT_ALLOWED', message: 'POST only' } }, 405);
  }

  const deviceId = req.headers.get('X-Device-Id');
  if (!deviceId) {
    return json({ error: { code: 'DEVICE_ID_REQUIRED', message: 'Missing X-Device-Id' } }, 401);
  }

  if (!checkRateLimit(deviceId)) {
    return json({ error: { code: 'RATE_LIMITED', message: 'Too many enrich requests' } }, 429);
  }

  let body: EnrichRequest;
  try {
    body = await req.json();
  } catch {
    return json({ error: { code: 'VALIDATION_ERROR', message: 'Invalid JSON body' } }, 400);
  }

  const word = body.word?.trim();
  if (!word) {
    return json({ error: { code: 'VALIDATION_ERROR', message: 'word is required' } }, 400);
  }

  const mode = body.mode === 'enrich' ? 'enrich' : 'full';
  if (mode === 'enrich' && !body.meaning?.trim() && !body.context?.trim() && !body.example?.trim()) {
    return json({
      error: {
        code: 'VALIDATION_ERROR',
        message: 'enrich mode requires meaning, context or example',
      },
    }, 400);
  }

  const nativeLanguage = body.native_language?.trim() || 'vi';
  const topic = body.topic?.trim() || 'Software Development';
  const roles = (body.workplace_roles?.length ? body.workplace_roles : ['PM', 'DEV']).slice(0, 4);

  let result: Record<string, unknown>;
  try {
    result = await generateWithLlm(body, word, mode, topic, roles, nativeLanguage);
  } catch (e) {
    console.error('vocab-enrich LLM error', e);
    result = mockEnrich(word, mode, body, topic, roles, nativeLanguage);
  }

  const dialogue = result.dialogue as Dialogue;
  const validation = validateDialogue(word, dialogue);
  if (!validation.valid) {
    result = mockEnrich(word, mode, body, topic, roles, nativeLanguage);
  }

  return json(result, 200);
});

async function generateWithLlm(
  body: EnrichRequest,
  word: string,
  mode: string,
  topic: string,
  roles: string[],
  nativeLanguage: string,
): Promise<Record<string, unknown>> {
  const apiKey = Deno.env.get('OPENAI_API_KEY') ?? Deno.env.get('ANTHROPIC_API_KEY');
  if (!apiKey) {
    return mockEnrich(word, mode, body, topic, roles, nativeLanguage);
  }

  const rawBase =
    Deno.env.get('OPENAI_BASE_URL') ??
    Deno.env.get('ANTHROPIC_BASE_URL') ??
    'https://api.openai.com/v1';
  const baseUrl = rawBase.replace(/\/$/, '').endsWith('/v1')
    ? rawBase.replace(/\/$/, '')
    : `${rawBase.replace(/\/$/, '')}/v1`;
  const model =
    Deno.env.get('OPENAI_MODEL') ??
    Deno.env.get('AI_DEFAULT_MODEL') ??
    Deno.env.get('ANTHROPIC_DEFAULT_SONNET_MODEL') ??
    'gpt-4o-mini';

  const systemPrompt = `You generate workplace English vocabulary lessons for software teams.
Return ONLY valid JSON with keys: word, meaning, pronunciation, partOfSpeech, context, example, topic, difficultyLevel, dialogue, explanationNative.
dialogue.lines: 2-5 items with speaker and text; target word must appear; at least 2 distinct speakers from: BA, Tester, PM, DEV, Customer, DevOps, Network.
explanationNative: { language, summary, usageInContext, grammarNotes } written in the user's native language code.`;

  const userPrompt = JSON.stringify({
    mode,
    word,
    partial: {
      meaning: body.meaning,
      context: body.context,
      example: body.example,
    },
    topic,
    workplace_roles: roles,
    native_language: nativeLanguage,
  });

  const res = await fetch(`${baseUrl}/chat/completions`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model,
      response_format: { type: 'json_object' },
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      temperature: 0.7,
    }),
  });

  if (!res.ok) {
    throw new Error(`OpenAI ${res.status}`);
  }

  const payload = await res.json();
  const content = payload.choices?.[0]?.message?.content;
  if (!content) throw new Error('Empty LLM response');
  return JSON.parse(content);
}

function mockEnrich(
  word: string,
  mode: string,
  body: EnrichRequest,
  topic: string,
  roles: string[],
  nativeLanguage: string,
): Record<string, unknown> {
  const roleA = roles[0] ?? 'PM';
  const roleB = roles[1] ?? 'DEV';
  const meaning = body.meaning?.trim() || `nghĩa của ${word} (workplace IT)`;
  const context = body.context?.trim() || `We need to ${word} before the release window closes.`;
  const example = body.example?.trim() || `The team will ${word} after QA approval.`;

  return {
    word,
    meaning,
    pronunciation: `/${word}/`,
    partOfSpeech: 'verb',
    context,
    example,
    topic,
    difficultyLevel: 2,
    dialogue: {
      scenario: `${topic} discussion`,
      workplaceRole: `${roleA}, ${roleB}`,
      lines: [
        { speaker: roleA, text: `Can we ${word} the update before the demo?` },
        { speaker: roleB, text: `Yes — we'll ${word} to staging first, then production.` },
        { speaker: roleA, text: `Great, ping me when the ${word} is done.` },
      ],
    },
    explanationNative: {
      language: nativeLanguage,
      summary: `${word}: ${meaning}`,
      usageInContext: `Dùng trong ngữ cảnh ${topic} khi giao tiếp công việc.`,
      grammarNotes: mode === 'full' ? 'Thường dùng trong câu khẳng định hoặc câu hỏi.' : undefined,
    },
  };
}

function validateDialogue(word: string, dialogue: Dialogue): { valid: boolean } {
  const lines = dialogue?.lines ?? [];
  if (lines.length < 2 || lines.length > 5) return { valid: false };
  const speakers = new Set<string>();
  let found = false;
  const re = new RegExp(`\\b${word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i');
  for (const line of lines) {
    if (!line.speaker?.trim() || !line.text?.trim()) return { valid: false };
    speakers.add(line.speaker.trim().toLowerCase());
    if (re.test(line.text)) found = true;
  }
  if (speakers.size < 2 || !found) return { valid: false };
  return { valid: true };
}

function checkRateLimit(deviceId: string): boolean {
  const now = Date.now();
  const hourMs = 60 * 60 * 1000;
  const entry = rateMap.get(deviceId);
  if (!entry || now > entry.resetAt) {
    rateMap.set(deviceId, { count: 1, resetAt: now + hourMs });
    return true;
  }
  if (entry.count >= RATE_LIMIT) return false;
  entry.count += 1;
  return true;
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
