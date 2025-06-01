import { BaseModel } from '@/models/Model';
import { Model } from 'objection';

export class SystemPlaidItem extends BaseModel {
  tenantId: number;
  plaidItemId: string;

  /**
   * Table name.
   */
  static get tableName() {
    return 'plaid_items';
  }

  /**
   * Timestamps columns.
   */
  get timestamps() {
    return ['createdAt', 'updatedAt'];
  }

  /**
   * Virtual attributes.
   */
  static get virtualAttributes() {
    return [];
  }

  /**
   * Relationship mapping.
   */
  static get relationMappings() {
    const { TenantModel } = require('../../System/models/TenantModel');

    return {
      /**
       * System user may belongs to tenant model.
       */
      tenant: {
        relation: Model.BelongsToOneRelation,
        modelClass: TenantModel,
        join: {
          from: 'users.tenantId',
          to: 'tenants.id',
        },
      },
    };
  }
}
