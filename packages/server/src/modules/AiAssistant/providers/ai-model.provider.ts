import { Provider } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createOpenAI } from '@ai-sdk/openai';
import type { LanguageModel } from 'ai';

export const AI_MODEL = Symbol('AI_MODEL');

export type AiLanguageModel = LanguageModel;

/**
 * Creates the OpenAI language model from the AI config.
 *
 * Returns null when no API key is configured; the controller/status endpoint
 * treats that as "disabled".
 */
export const aiModelProvider: Provider = {
  provide: AI_MODEL,
  inject: [ConfigService],
  useFactory: (configService: ConfigService): AiLanguageModel | null => {
    const apiKey = configService.get<string>('ai.apiKey');
    if (!apiKey) {
      return null;
    }
    const provider = createOpenAI({
      apiKey,
      baseURL: configService.get<string>('ai.baseUrl') || undefined,
    });
    return provider(configService.get<string>('ai.model'));
  },
};
