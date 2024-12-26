import { Model } from 'objection';
import { BaseModel } from '@/models/Model';

export class TransactionPaymentServiceEntry extends BaseModel {
  /**
   * Table name
   */
  static get tableName() {
    return 'transactions_payment_methods';
  }

  /**
   * Json schema of the model.
   */
  static get jsonSchema() {
    return {
      type: 'object',
      required: ['paymentIntegrationId'],
      properties: {
        id: { type: 'integer' },
        referenceId: { type: 'integer' },
        referenceType: { type: 'string' },
        paymentIntegrationId: { type: 'integer' },
        enable: { type: 'boolean' },
        options: { type: 'object' },
      },
    };
  }

  /**
   * Relationship mapping.
   */
  static get relationMappings() {
    const { PaymentIntegration } = require('./PaymentIntegration.model');

    return {
      paymentIntegration: {
        relation: Model.BelongsToOneRelation,
        modelClass: PaymentIntegration,
        join: {
          from: 'transactions_payment_methods.paymentIntegrationId',
          to: 'payment_integrations.id',
        },
      },
    };
  }
}
