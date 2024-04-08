import SystemModel from '@/system/models/SystemModel';
import { Model } from 'objection';

export default class SystemPlaidItem extends SystemModel {
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
    const Tenant = require('./Tenant');

    return {
      /**
       * System user may belongs to tenant model.
       */
      tenant: {
        relation: Model.BelongsToOneRelation,
        modelClass: Tenant.default,
        join: {
          from: 'users.tenantId',
          to: 'tenants.id',
        },
      },
    };
  }
}
