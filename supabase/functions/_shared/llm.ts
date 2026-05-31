/** OpenAI-compatible chat/completions — gateway Anthropic nội bộ. */
export async function chatCompletion(
  systemPrompt: string,
  messages: { role: 'user' | 'assistant'; content: string }[],
  options?: { temperature?: number; jsonMode?: boolean },
): Promise<string> {
  const apiKey = Deno.env.get('OPENAI_API_KEY') ?? Deno.env.get('ANTHROPIC_API_KEY');
  if (!apiKey) throw new Error('MISSING_AI_API_KEY');

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

  const res = await fetch(`${baseUrl}/chat/completions`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model,
      ...(options?.jsonMode ? { response_format: { type: 'json_object' } } : {}),
      messages: [{ role: 'system', content: systemPrompt }, ...messages],
      temperature: options?.temperature ?? 0.7,
    }),
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`LLM ${res.status}: ${errText.slice(0, 200)}`);
  }

  const payload = await res.json();
  const content = payload.choices?.[0]?.message?.content;
  if (!content || typeof content !== 'string') throw new Error('Empty LLM response');
  return content;
}
