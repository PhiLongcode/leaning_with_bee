// Placeholder Edge Function — SRS review (implement OpenAI / SM-2 later)
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: cors() });
  }
  const deviceId = req.headers.get('X-Device-Id');
  if (!deviceId) {
    return json({ error: { code: 'DEVICE_ID_REQUIRED', message: 'Missing X-Device-Id' } }, 401);
  }
  return json({ message: 'learning-review not implemented yet', deviceId }, 501);
});

function cors() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-device-id',
  };
}

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...cors(), 'Content-Type': 'application/json' },
  });
}
