import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { TenantModelProxy } from '@/modules/System/models/TenantBaseModel';
import { AiConversation } from './models/AiConversation.model';
import { AiMessage, AiMessageRole } from './models/AiMessage.model';
import {
  IAiChatMessage,
  IAiConversationSummary,
  IAiConversationWithMessages,
  AiMessageFeedback,
} from './AiAssistant.types';

const MAX_TITLE_LENGTH = 80;
const MAX_CONVERSATIONS = 50;

const parseJson = <T>(value: unknown, fallback: T): T => {
  if (value === null || value === undefined) {
    return fallback;
  }
  if (typeof value === 'string') {
    try {
      return JSON.parse(value) as T;
    } catch {
      return fallback;
    }
  }
  return value as T;
};

const extractText = (parts: any[]): string => {
  if (!Array.isArray(parts)) {
    return '';
  }
  return parts
    .filter(
      (part) => part && part.type === 'text' && typeof part.text === 'string',
    )
    .map((part) => part.text)
    .join(' ')
    .replace(/\s+/g, ' ')
    .trim();
};

const buildTitle = (message: IAiChatMessage): string | null => {
  const text = extractText(message.parts) || '';
  if (!text) {
    return null;
  }
  return text.length > MAX_TITLE_LENGTH
    ? `${text.slice(0, MAX_TITLE_LENGTH - 1)}…`
    : text;
};

@Injectable()
export class AiConversationService {
  constructor(
    @Inject(AiConversation.name)
    private readonly conversationModel: TenantModelProxy<typeof AiConversation>,

    @Inject(AiMessage.name)
    private readonly messageModel: TenantModelProxy<typeof AiMessage>,
  ) {}

  /**
   * Creates an empty conversation owned by the system user.
   */
  public async create(systemUserId: number): Promise<AiConversation> {
    return this.conversationModel()
      .query()
      .insertAndFetch({
        systemUserId,
        title: null,
        updatedAt: new Date(),
      } as any);
  }

  /**
   * Lists the current user's conversations, newest first.
   */
  public async list(systemUserId: number): Promise<IAiConversationSummary[]> {
    const conversations = await this.conversationModel()
      .query()
      .where('systemUserId', systemUserId)
      .select('id', 'title', 'createdAt', 'updatedAt')
      .orderBy('updatedAt', 'desc')
      .limit(MAX_CONVERSATIONS);

    return conversations as unknown as IAiConversationSummary[];
  }

  /**
   * Retrieves one conversation and its messages.
   */
  public async getWithMessages(
    systemUserId: number,
    conversationId: number,
  ): Promise<IAiConversationWithMessages> {
    const conversation = await this.findOwnedConversation(
      systemUserId,
      conversationId,
    );

    const messages = await this.messageModel()
      .query()
      .where('conversationId', conversationId)
      .orderBy('id', 'asc');

    return {
      id: conversation.id,
      title: conversation.title,
      createdAt: conversation.createdAt,
      updatedAt: conversation.updatedAt,
      messages: messages.map((message) => this.toChatMessage(message)),
    };
  }

  /**
   * Deletes a conversation. Messages are removed by the foreign key cascade.
   */
  public async delete(
    systemUserId: number,
    conversationId: number,
  ): Promise<void> {
    const deleted = await this.conversationModel()
      .query()
      .delete()
      .where({ id: conversationId, systemUserId });

    if (!deleted) {
      throw new NotFoundException('Conversation not found.');
    }
  }

  /**
   * Verifies that the conversation belongs to the current user.
   */
  public async findOwnedConversation(
    systemUserId: number,
    conversationId: number,
  ): Promise<AiConversation> {
    const conversation = await this.conversationModel()
      .query()
      .findOne({ id: conversationId, systemUserId });

    if (!conversation) {
      throw new NotFoundException('Conversation not found.');
    }
    return conversation;
  }

  /**
   * Persists a user message, deduplicating by message id.
   */
  public async saveUserMessage(
    conversation: AiConversation,
    message: IAiChatMessage,
  ): Promise<void> {
    const exists = await this.messageModel().query().findOne({
      conversationId: conversation.id,
      messageId: message.id,
    });

    if (exists) {
      return;
    }

    const now = new Date();
    const title =
      conversation.title?.trim() || buildTitle(message) || conversation.title;

    await this.conversationModel().transaction(async (trx) => {
      await this.messageModel()
        .query(trx)
        .insert({
          conversationId: conversation.id,
          messageId: message.id,
          role: 'user' as AiMessageRole,
          parts: JSON.stringify(message.parts ?? []),
          content: extractText(message.parts) || null,
          metadata: message.metadata ? JSON.stringify(message.metadata) : null,
        } as any);

      await this.conversationModel()
        .query(trx)
        .patch({
          title: title ?? null,
          updatedAt: now,
        })
        .where('id', conversation.id);
    });
  }

  /**
   * Persists the assistant response after the stream finishes.
   */
  public async saveAssistantMessage(
    conversationId: number,
    message: IAiChatMessage,
    metadata: Record<string, any>,
  ): Promise<void> {
    const messageId = message.id || randomUUID();

    await this.messageModel()
      .query()
      .insert({
        conversationId,
        messageId,
        role: 'assistant' as AiMessageRole,
        parts: JSON.stringify(message.parts ?? []),
        content: extractText(message.parts) || null,
        metadata: JSON.stringify(metadata ?? {}),
      } as any);

    await this.conversationModel()
      .query()
      .patch({ updatedAt: new Date() })
      .where('id', conversationId);
  }

  /**
   * Stores the current user's rating of an assistant message. Passing `null`
   * clears a previous rating.
   */
  public async setMessageFeedback(
    systemUserId: number,
    conversationId: number,
    messageId: string,
    feedback: AiMessageFeedback | null,
  ): Promise<{ messageId: string; feedback: AiMessageFeedback | null }> {
    await this.findOwnedConversation(systemUserId, conversationId);

    const message = await this.messageModel().query().findOne({
      conversationId,
      messageId,
      role: 'assistant',
    });

    if (!message) {
      throw new NotFoundException('Assistant message not found.');
    }

    await this.messageModel()
      .query()
      .patch({ feedback })
      .where('id', message.id);

    return { messageId, feedback };
  }

  /**
   * Removes assistant messages after the latest user message so a regenerated
   * response replaces the previous one instead of duplicating it.
   */
  public async prepareRegenerate(conversationId: number): Promise<void> {
    const lastUserMessage = await this.messageModel()
      .query()
      .where({ conversationId, role: 'user' })
      .orderBy('id', 'desc')
      .first();

    if (!lastUserMessage) {
      return;
    }

    await this.messageModel()
      .query()
      .delete()
      .where('conversationId', conversationId)
      .where('role', 'assistant')
      .where('id', '>', lastUserMessage.id);
  }

  private toChatMessage(message: AiMessage): IAiChatMessage {
    const metadata =
      parseJson<Record<string, any> | null>(message.metadata, null) ?? {};

    return {
      id: message.messageId,
      role: message.role,
      parts: parseJson<any[]>(message.parts, []),
      metadata:
        message.role === 'assistant'
          ? { ...metadata, feedback: message.feedback ?? null }
          : metadata,
    };
  }
}
