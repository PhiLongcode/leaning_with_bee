import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.1';
import { chatCompletion } from '../_shared/llm.ts';

type TranscriptMessage = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  createdAt: string;
};

type Transcript = {
  messages: TranscriptMessage[];
  scenarioTitle?: string;
};

const MOCK_SCENARIOS: Record<string, { title: string; description: string }> = {
  'sc-standup': {
    title: 'Stand-up update',
    description: 'Report progress and blockers in a daily stand-up.',
  },
  'sc-interview': {
    title: 'Technical Interview',
    description: 'Answer technical and behavioral questions.',
  },
};

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

  const action = String(body.action ?? '');
  const supabase = adminClient();

  try {
    if (action === 'start') {
      return await handleStart(supabase, deviceId, String(body.scenarioId ?? ''));
    }
    if (action === 'history') {
      return await handleHistory(supabase, deviceId, String(body.sessionId ?? ''));
    }
    if (action === 'message') {
      return await handleMessage(
        supabase,
        deviceId,
        String(body.sessionId ?? ''),
        String(body.content ?? ''),
      );
    }
    return json({ error: { code: 'VALIDATION_ERROR', message: 'Unknown action' } }, 400);
  } catch (e) {
    console.error('ai-conversation', e);
    return json({ error: { code: 'AI_ERROR', message: String(e) } }, 500);
  }
});

async function handleStart(
  supabase: ReturnType<typeof adminClient>,
  deviceId: string,
  scenarioId: string,
) {
  if (!scenarioId) {
    return json({ error: { code: 'VALIDATION_ERROR', message: 'scenarioId required' } }, 400);
  }

  let scenarioTitle = MOCK_SCENARIOS[scenarioId]?.title;
  let dbScenarioId: string | null = null;

  const isUuid = /^[0-9a-f-]{36}$/i.test(scenarioId);
  if (isUuid) {
    const { data } = await supabase
      .from('conversation_scenarios')
      .select('id, title')
      .eq('id', scenarioId)
      .maybeSingle();
    if (data) {
      dbScenarioId = data.id;
      scenarioTitle = data.title;
    }
  } else if (MOCK_SCENARIOS[scenarioId]) {
    scenarioTitle = MOCK_SCENARIOS[scenarioId].title;
  }

  const welcome: TranscriptMessage = {
    id: 'welcome',
    role: 'assistant',
    content: scenarioTitle
      ? `Let's practice: ${scenarioTitle}. How would you start?`
      : 'Hello! How can we practice workplace English today?',
    createdAt: new Date().toISOString(),
  };

  const transcript: Transcript = { messages: [welcome], scenarioTitle };

  const { data: row, error } = await supabase
    .from('conversation_logs')
    .insert({
      device_id: deviceId,
      scenario_id: dbScenarioId,
      transcript,
    })
    .select('id')
    .single();

  if (error) throw error;

  return json({ sessionId: row.id, messages: transcript.messages });
}

async function handleHistory(
  supabase: ReturnType<typeof adminClient>,
  deviceId: string,
  sessionId: string,
) {
  const transcript = await loadTranscript(supabase, deviceId, sessionId);
  if (!transcript) {
    return json({ error: { code: 'NOT_FOUND', message: 'Session not found' } }, 404);
  }
  return json({ messages: transcript.messages });
}

async function handleMessage(
  supabase: ReturnType<typeof adminClient>,
  deviceId: string,
  sessionId: string,
  content: string,
) {
  const text = content.trim();
  if (!sessionId || !text) {
    return json({ error: { code: 'VALIDATION_ERROR', message: 'sessionId and content required' } }, 400);
  }

  const transcript = await loadTranscript(supabase, deviceId, sessionId);
  if (!transcript) {
    return json({ error: { code: 'NOT_FOUND', message: 'Session not found' } }, 404);
  }

  const userMsg: TranscriptMessage = {
    id: `msg-${Date.now()}`,
    role: 'user',
    content: text,
    createdAt: new Date().toISOString(),
  };
  transcript.messages.push(userMsg);

  let assistantContent: string;
  try {
    const llmMessages = transcript.messages
      .filter((m) => m.id !== 'welcome' || m.role === 'user')
      .map((m) => ({ role: m.role, content: m.content }));
    assistantContent = await chatCompletion(
      `You are an English workplace conversation coach for software teams.
Scenario: ${transcript.scenarioTitle ?? 'General workplace English'}.
Reply in English only, 1-3 short sentences. Ask follow-up questions. Be encouraging.`,
      llmMessages.slice(-12),
      { temperature: 0.8 },
    );
  } catch {
    assistantContent = fallbackReply(transcript.messages.length);
  }

  const assistantMsg: TranscriptMessage = {
    id: `msg-${Date.now()}-ai`,
    role: 'assistant',
    content: assistantContent.trim(),
    createdAt: new Date().toISOString(),
  };
  transcript.messages.push(assistantMsg);

  const { error } = await supabase
    .from('conversation_logs')
    .update({ transcript })
    .eq('id', sessionId)
    .eq('device_id', deviceId);

  if (error) throw error;

  return json({ messages: transcript.messages });
}

async function loadTranscript(
  supabase: ReturnType<typeof adminClient>,
  deviceId: string,
  sessionId: string,
): Promise<Transcript | null> {
  const { data, error } = await supabase
    .from('conversation_logs')
    .select('transcript')
    .eq('id', sessionId)
    .eq('device_id', deviceId)
    .maybeSingle();
  if (error || !data?.transcript) return null;
  const t = data.transcript as Transcript;
  if (!Array.isArray(t.messages)) return { messages: [] };
  return t;
}

function fallbackReply(messageCount: number): string {
  const replies = [
    'Interesting — can you walk me through your approach?',
    'How would you handle that in a production environment?',
    'Could you give a concrete example from your last project?',
    'What trade-offs did you consider?',
  ];
  return replies[messageCount % replies.length]!;
}

function adminClient() {
  const url = Deno.env.get('SUPABASE_URL')!;
  const key = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
  return createClient(url, key);
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
