import { Model } from 'objection';
import { TenantBaseModel } from '@/modules/System/models/TenantBaseModel';
import { TenantUser } from '../../Tenancy/TenancyModels/models/TenantUser.model';

export class TenantNotification extends TenantBaseModel {
  public id!: number;
  public userId!: number | null;
  public title!: string;
  public message!: string;
  public type!: 'success' | 'info' | 'warning' | 'error';
  public category!: 'inventory' | 'billing' | 'system' | 'export' | 'report';
  public metadata!: Record<string, any> | null;
  public readAt!: Date | string | null;
  public createdAt!: Date;
  public updatedAt!: Date;

  /**
   * Table name.
   */
  static get tableName() {
    return 'notifications';
  }

  /**
   * JSON columns only. Without this, Objection infers JSON attributes from jsonSchema; `readAt`
   * would match `type: object` in anyOf and get JSON.stringify'd, breaking MySQL DATETIME updates.
   */
  static get jsonAttributes() {
    return ['metadata'];
  }

  /**
   * Timestamps columns.
   */
  static get timestamps() {
    return ['createdAt', 'updatedAt'];
  }

  /**
   * Virtual attributes.
   */
  static get virtualAttributes() {
    return ['isRead'];
  }

  /**
   * Check if notification has been read.
   */
  get isRead(): boolean {
    return this.readAt !== null && this.readAt !== undefined;
  }

  /**
   * Model modifiers.
   */
  static get modifiers() {
    return {
      /**
       * Filter by user (or broadcast notifications with null userId).
       */
      forUser(query, userId: number) {
        query.where(function () {
          this.where('userId', userId).orWhereNull('userId');
        });
      },

      /**
       * Filter unread notifications.
       */
      unread(query) {
        query.whereNull('readAt');
      },

      /**
       * Filter read notifications.
       */
      read(query) {
        query.whereNotNull('readAt');
      },

      /**
       * Order by createdAt descending (newest first).
       */
      newestFirst(query) {
        query.orderBy('createdAt', 'desc');
      },

      /**
       * Filter by category.
       */
      byCategory(query, category: string) {
        query.where('category', category);
      },

      /**
       * Filter by type.
       */
      byType(query, type: string) {
        query.where('type', type);
      },
    };
  }

  /**
   * Relationship mapping.
   */
  static get relationMappings() {
    return {
      /**
       * Notification belongs to a tenant user (`users` in the tenant database).
       */
      user: {
        relation: Model.BelongsToOneRelation,
        modelClass: TenantUser,
        join: {
          from: 'notifications.userId',
          to: 'users.id',
        },
      },
    };
  }

  /**
   * JSON schema for validation.
   */
  static get jsonSchema() {
    return {
      type: 'object',
      required: ['title', 'message'],
      properties: {
        id: { type: 'integer' },
        userId: { type: ['integer', 'null'] },
        title: { type: 'string', minLength: 1, maxLength: 255 },
        message: { type: 'string', minLength: 1 },
        type: { type: 'string', enum: ['success', 'info', 'warning', 'error'] },
        category: { type: 'string', enum: ['inventory', 'billing', 'system', 'export', 'report'] },
        metadata: { type: ['object', 'null'] },
        // `Date` is allowed on patch; mysql2 binds it as DATETIME (see jsonAttributes above).
        readAt: {
          anyOf: [
            { type: 'null' },
            { type: 'string', format: 'date-time' },
            { type: 'object' },
          ],
        },
        createdAt: { type: 'string', format: 'date-time' },
        updatedAt: { type: 'string', format: 'date-time' },
      },
    };
  }
}
