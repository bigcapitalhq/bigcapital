import { Model } from 'objection';
import TenantModel from 'models/TenantModel';

export class PaymentIntegration extends Model {
  paymentEnabled!: boolean;
  payoutEnabled!: boolean;

  static get tableName() {
    return 'payment_integrations';
  }

  static get idColumn() {
    return 'id';
  }

  static get virtualAttributes() {
    return ['fullEnabled'];
  }

  static get jsonAttributes() {
    return ['options'];
  }

  get fullEnabled() {
    return this.paymentEnabled && this.payoutEnabled;
  }

  static get modifiers() {
    return {
      /**
       * Query to filter enabled payment and payout.
       */
      fullEnabled(query) {
        query.where('paymentEnabled', true).andWhere('payoutEnabled', true);
      },
    };
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['name', 'service'],
      properties: {
        id: { type: 'integer' },
        service: { type: 'string' },
        paymentEnabled: { type: 'boolean' },
        payoutEnabled: { type: 'boolean' },
        accountId: { type: 'string' },
        options: {
          type: 'object',
          properties: {
            bankAccountId: { type: 'number' },
            clearingAccountId: { type: 'number' },
          },
        },
        createdAt: { type: 'string', format: 'date-time' },
        updatedAt: { type: 'string', format: 'date-time' },
      },
    };
  }
}
