import { SystemModel } from '@/modules/System/models/SystemModel';
import { Model } from 'objection';

export class ApiKeyModel extends SystemModel {
  readonly key: string;
  readonly name?: string;
  readonly createdAt: Date;
  readonly expiresAt?: Date;
  readonly revokedAt?: Date;
  readonly userId: number;
  readonly tenantId: number;

  get revoked() {
    return !!this.revokedAt;
  }

  static get virtualAttributes() {
    return ['revoked'];
  }

  /**
   * Table name
   */
  static get tableName() {
    return 'api_keys';
  }

  /**
   * Timestamps columns.
   */
  get timestamps() {
    return ['createdAt'];
  }

  /**
   * Relation mappings for Objection.js
   */
  static get relationMappings() {
    const { SystemUser } = require('../../System/models/SystemUser');
    const { TenantModel } = require('../../System/models/TenantModel');

    return {
      user: {
        relation: Model.BelongsToOneRelation,
        modelClass: SystemUser,
        join: {
          from: 'api_keys.userId',
          to: 'users.id',
        },
      },
      tenant: {
        relation: Model.BelongsToOneRelation,
        modelClass: TenantModel,
        join: {
          from: 'api_keys.tenantId',
          to: 'tenants.id',
        },
      },
    };
  }

  /**
   * Model modifiers.
   */
  static get modifiers() {
    return {
      notRevoked(query) {
        query.whereNull('revokedAt');
      },
    };
  }
}
