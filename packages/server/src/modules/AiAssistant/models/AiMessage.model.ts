import { Model } from 'objection';
import { TenantBaseModel } from '@/modules/System/models/TenantBaseModel';
import type { AiMessageFeedback } from '../AiAssistant.types';
import type { AiConversation } from './AiConversation.model';

export type AiMessageRole = 'user' | 'assistant' | 'system';

export class AiMessage extends TenantBaseModel {
  public id!: number;
  public conversationId!: number;
  public messageId!: string;
  public role!: AiMessageRole;
  public parts!: any[];
  public content!: string | null;
  public metadata!: Record<string, any> | null;
  public feedback!: AiMessageFeedback | null;
  public createdAt!: Date;
  public updatedAt!: Date;

  public conversation?: AiConversation;

  /**
   * Table name.
   */
  static get tableName() {
    return 'ai_messages';
  }

  /**
   * Timestamps columns.
   */
  get timestamps() {
    return ['createdAt', 'updatedAt'];
  }

  /**
   * Relations.
   */
  static get relationMappings() {
    const { AiConversation } = require('./AiConversation.model');

    return {
      conversation: {
        relation: Model.BelongsToOneRelation,
        modelClass: AiConversation,
        join: {
          from: 'ai_messages.conversationId',
          to: 'ai_conversations.id',
        },
      },
    };
  }
}
