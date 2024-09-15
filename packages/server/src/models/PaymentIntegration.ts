import { Model } from 'objection';

export class PaymentIntegration extends Model {
  static get tableName() {
    return 'payment_integrations';
  }

  static get idColumn() {
    return 'id';
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['service', 'enable'],
      properties: {
        id: { type: 'integer' },
        service: { type: 'string' },
        enable: { type: 'boolean' },
        accountId: { type: 'string' },
        options: { type: 'object' },
        createdAt: { type: 'string', format: 'date-time' },
        updatedAt: { type: 'string', format: 'date-time' },
      },
    };
  }
}
