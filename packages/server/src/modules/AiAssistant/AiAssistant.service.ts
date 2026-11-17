import {
  BadRequestException,
  ForbiddenException,
  Inject,
  Injectable,
  Logger,
  ServiceUnavailableException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClsService } from 'nestjs-cls';
import { Knex } from 'knex';
import * as moment from 'moment';
import {
  convertToModelMessages,
  pruneMessages,
  safeValidateUIMessages,
  stepCountIs,
  streamText,
  type ModelMessage,
  type StreamTextResult,
  type ToolSet,
  type UIMessage,
} from 'ai';
import { Ability } from '@casl/ability';
import { TENANCY_DB_CONNECTION } from '@/modules/Tenancy/TenancyDB/TenancyDB.constants';
import { TenancyContext } from '@/modules/Tenancy/TenancyContext.service';
import { AccountingBasisService } from '@/modules/FinancialStatements/common/AccountingBasisService';
import { AbilitySubject } from '@/modules/Roles/Roles.types';
import { ReportsAction } from '@/modules/FinancialStatements/types/Report.types';
import { AI_MODEL, AiLanguageModel } from './providers/ai-model.provider';
import { AiConversationService } from './AiConversation.service';
import { AiToolsFactory } from './tools/ai-tools.factory';
import { buildSystemPrompt } from './prompts/system-prompt';
import {
  IAiChatMessage,
  IAiToolContext,
  AiMessageStatus,
} from './AiAssistant.types';
import { AiConversation } from './models/AiConversation.model';

export interface IAiStreamChatArgs {
  conversationId: number;
  messages: unknown[];
  trigger: 'submit-message' | 'regenerate-message';
  messageId?: string;
  ability?: Ability;
  abortSignal?: AbortSignal;
}

export interface IAiStreamChatResult {
  conversation: AiConversation;
  originalMessages: UIMessage[];
  result: StreamTextResult<ToolSet, any>;
  messageMetadata: (options: { part: any }) => Record<string, any> | undefined;
  onFinish: (options: {
    responseMessage: UIMessage;
    isAborted: boolean;
    outcome: { status: string; error?: unknown };
  }) => Promise<void>;
  onError: (error: unknown) => string;
}

@Injectable()
export class AiAssistantService {
  private readonly logger = new Logger(AiAssistantService.name);

  constructor(
    private readonly configService: ConfigService,
    private readonly clsService: ClsService,
    private readonly tenancyContext: TenancyContext,
    private readonly accountingBasisService: AccountingBasisService,
    private readonly conversationService: AiConversationService,

    @Inject(TENANCY_DB_CONNECTION)
    private readonly tenantKnex: () => Knex,

    @Inject(AI_MODEL)
    private readonly model: AiLanguageModel | null,
  ) {}

  /**
   * Returns whether the assistant is configured and the current user has
   * access to at least one report.
   */
  public getStatus(ability?: Ability): {
    enabled: boolean;
    authorized: boolean;
    model: string;
  } {
    return {
      enabled:
        this.configService.get<boolean>('ai.enabled') === true &&
        this.model !== null,
      authorized: this.hasReportAccess(ability),
      model: this.configService.get<string>('ai.model'),
    };
  }

  /**
   * Prepares a streaming chat response and persists the user turn.
   */
  public async streamChat({
    conversationId,
    messages,
    trigger,
    ability,
    abortSignal,
  }: IAiStreamChatArgs): Promise<IAiStreamChatResult> {
    if (!this.model || this.configService.get<boolean>('ai.enabled') !== true) {
      throw new ServiceUnavailableException(
        'The AI assistant is not configured.',
      );
    }
    if (!this.hasReportAccess(ability)) {
      throw new ForbiddenException(
        'You do not have access to the AI assistant.',
      );
    }

    // Capture the tenant connection while the request CLS context is active.
    // Tool executions run later, while the response streams.
    const knex = this.tenantKnex();
    const systemUserId = this.clsService.get<number>('userId');
    if (!systemUserId) {
      throw new ForbiddenException('The authenticated user was not found.');
    }

    const validated = await safeValidateUIMessages({ messages });
    if (!validated.success) {
      throw new BadRequestException('Invalid chat messages.');
    }

    const uiMessages = validated.data.filter(
      (message) => message.role !== 'system',
    );
    if (uiMessages.length === 0) {
      throw new BadRequestException('No chat messages were provided.');
    }

    const conversation = await this.conversationService.findOwnedConversation(
      systemUserId,
      conversationId,
    );

    const lastUserMessage = [...uiMessages]
      .reverse()
      .find((message) => message.role === 'user') as IAiChatMessage | undefined;

    if (trigger === 'regenerate-message') {
      await this.conversationService.prepareRegenerate(conversationId);
    } else if (lastUserMessage) {
      await this.conversationService.saveUserMessage(
        conversation,
        lastUserMessage,
      );
    }

    const metadata = await this.tenancyContext.getTenantMetadata();
    const accountingBasis = await this.accountingBasisService.resolve();
    const toolContext: IAiToolContext = {
      organizationName: metadata?.name ?? '',
      baseCurrency: metadata?.baseCurrency ?? 'USD',
      fiscalYear: metadata?.fiscalYear ?? null,
      accountingBasis,
    };

    const tools = new AiToolsFactory({
      knex,
      ability: ability as Ability,
      baseCurrency: toolContext.baseCurrency,
      accountingBasis,
      fiscalYear: toolContext.fiscalYear,
    }).build();

    let modelMessages: ModelMessage[];
    try {
      modelMessages = pruneMessages({
        messages: await convertToModelMessages(uiMessages),
        reasoning: 'all',
        toolCalls: 'before-last-4-messages',
        emptyMessages: 'remove',
      }).slice(-30);
    } catch {
      throw new BadRequestException('Invalid chat messages.');
    }

    const instructions = buildSystemPrompt({
      ...toolContext,
      today: moment().format('YYYY-MM-DD'),
    });
    const aiConfig = this.configService.get('ai');
    const modelId = this.configService.get<string>('ai.model');

    const result = streamText({
      model: this.model,
      system: instructions,
      messages: modelMessages,
      tools,
      stopWhen: stepCountIs(aiConfig.maxSteps),
      maxOutputTokens: aiConfig.maxOutputTokens,
      abortSignal,
      timeout: { totalMs: aiConfig.requestTimeoutMs, stepMs: 30000 },
      allowSystemInMessages: false,
      providerOptions: {
        openai: {
          store: false,
          reasoningEffort: aiConfig.reasoningEffort as any,
        },
      },
    });

    return {
      conversation,
      originalMessages: uiMessages,
      result,
      messageMetadata: ({ part }) => {
        if (part.type === 'start') {
          return { createdAt: Date.now(), model: modelId };
        }
        if (part.type === 'finish') {
          return {
            model: modelId,
            finishReason: part.finishReason,
            usage: part.totalUsage,
          };
        }
        return undefined;
      },
      onFinish: async ({ responseMessage, isAborted, outcome }) => {
        const status: AiMessageStatus = isAborted
          ? 'aborted'
          : outcome.status === 'completed'
            ? 'completed'
            : 'failed';

        const parts = responseMessage?.parts?.length
          ? responseMessage.parts
          : status === 'failed'
            ? [
                {
                  type: 'text',
                  text: 'I could not complete that request. Please try again.',
                },
              ]
            : [];

        if (!parts.length) {
          return;
        }

        try {
          await this.conversationService.saveAssistantMessage(
            conversationId,
            {
              id: responseMessage.id,
              role: 'assistant',
              parts,
              metadata: responseMessage.metadata,
            },
            {
              model: modelId,
              status,
              aborted: isAborted,
              finishReason: (responseMessage.metadata as any)?.finishReason,
              usage: (responseMessage.metadata as any)?.usage,
            },
          );

          this.logger.log(
            JSON.stringify({
              event: 'ai_chat_finished',
              organizationId: this.clsService.get('organizationId'),
              userId: this.clsService.get('userId'),
              conversationId,
              status,
              usage: (responseMessage.metadata as any)?.usage,
            }),
          );
        } catch (error) {
          this.logger.error(
            `Failed to persist AI conversation message: ${
              (error as Error)?.message ?? error
            }`,
          );
        }
      },
      onError: (error) => {
        this.logger.error(
          `AI chat stream failed: ${(error as Error)?.message ?? error}`,
        );
        const status =
          (error as any)?.statusCode ?? (error as any)?.status ?? undefined;

        if (status === 429) {
          return 'Too many requests. Please wait a moment and try again.';
        }
        if (status === 401 || status === 403) {
          return 'The AI service is not configured correctly. Please contact your administrator.';
        }
        return 'The AI assistant is temporarily unavailable. Please try again.';
      },
    };
  }

  /**
   * True when the user has at least one financial report read ability.
   */
  private hasReportAccess(ability?: Ability): boolean {
    if (!ability) {
      return false;
    }
    return Object.values(ReportsAction).some((action) =>
      ability.can(action, AbilitySubject.Report),
    );
  }
}
