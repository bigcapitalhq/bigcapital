import { registerAs } from '@nestjs/config';

const REASONING_EFFORTS = [
  'none',
  'minimal',
  'low',
  'medium',
  'high',
  'xhigh',
  'max',
];

const parseInteger = (value: string | undefined, fallback: number): number => {
  const parsed = parseInt(value ?? '', 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
};

const parseReasoningEffort = (value: string | undefined): string => {
  return value && REASONING_EFFORTS.includes(value) ? value : 'low';
};

export default registerAs('ai', () => {
  const apiKey = process.env.OPENAI_API_KEY?.trim();

  return {
    enabled: process.env.AI_ASSISTANT_ENABLED !== 'false' && Boolean(apiKey),
    apiKey: apiKey || undefined,
    baseUrl: process.env.OPENAI_BASE_URL?.trim() || undefined,
    model: process.env.OPENAI_MODEL?.trim() || 'gpt-6-luna',
    reasoningEffort: parseReasoningEffort(
      process.env.AI_REASONING_EFFORT?.trim().toLowerCase(),
    ),
    maxSteps: parseInteger(process.env.AI_MAX_STEPS, 6),
    maxOutputTokens: parseInteger(process.env.AI_MAX_OUTPUT_TOKENS, 1500),
    requestTimeoutMs: parseInteger(process.env.AI_REQUEST_TIMEOUT_MS, 60000),
  };
});
