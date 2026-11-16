import { Model } from 'objection';
import { TenantBaseModel } from '@/modules/System/models/TenantBaseModel';
import type { AiMessage } from './AiMessage.model';

export class AiConversation extends TenantBaseModel {
  public id!: number;
  public systemUserId!: number;
  public title!: string | null;
  public createdAt!: Date;
  public updatedAt!: Date;

  public messages?: AiMessage[];

  /**
   * Table name.
   */
  static get tableName() {
    return 'ai_conversations';
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
    const { AiMessage } = require('./AiMessage.model');

    return {
      messages: {
        relation: Model.HasManyRelation,
        modelClass: AiMessage,
        join: {
          from: 'ai_conversations.id',
          to: 'ai_messages.conversationId',
        },
      },
    };
  }
}
