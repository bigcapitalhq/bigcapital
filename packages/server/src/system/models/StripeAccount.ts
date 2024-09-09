import { Model } from 'objection';

export class StripeAccount {
  /**
   * Table name
   */
  static get tableName() {
    return 'stripe_accounts';
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
   * Model modifiers.
   */
  static get modifiers() {
    return {};
  }

  /**
   * Relationship mapping.
   */
  static get relationMappings() {
    const Tenant = require('./Tenant');

    return {
      tenant: {
        relation: Model.BelongsToOneRelation,
        modelClass: Tenant.default,
        join: {
          from: 'stripe_accounts.tenant_id',
          to: 'tenants.id',
        },
      },
    };
  }
}
