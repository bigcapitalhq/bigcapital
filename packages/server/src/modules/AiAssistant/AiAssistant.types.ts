import type { AiMessage } from './models/AiMessage.model';
import type { AccountingBasis } from '@/common/types/AccountingBasis';

export type AiMessageStatus = 'completed' | 'aborted' | 'failed';

export interface IAiToolContext {
  organizationName: string;
  baseCurrency: string;
  fiscalYear: string | null;
  accountingBasis: AccountingBasis;
}

export interface IAiChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  parts: any[];
  metadata?: unknown;
}

export interface IAiConversationSummary {
  id: number;
  title: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface IAiConversationWithMessages {
  id: number;
  title: string | null;
  createdAt: Date;
  updatedAt: Date;
  messages: IAiChatMessage[];
}

export interface IAiAssistantStreamOptions {
  conversation: {
    id: number;
    title: string | null;
  };
  messages: IAiChatMessage[];
  trigger: 'submit-message' | 'regenerate-message';
  messageId?: string;
  toolContext: IAiToolContext;
  tools: Record<string, any>;
  onFinish: (args: {
    responseMessage: IAiChatMessage;
    isAborted: boolean;
    status: AiMessageStatus;
  }) => Promise<void>;
}

export type AiMessageModel = AiMessage;
