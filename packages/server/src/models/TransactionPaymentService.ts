import { Model, mixin } from 'objection';
import TenantModel from 'models/TenantModel';

export class TransactionPaymentService extends TenantModel {
  /**
   * Table name
   */
  static get tableName() {
    return 'transactions_payment_services';
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['service', 'enable'],
      properties: {
        id: { type: 'integer' },
        reference_id: { type: 'integer' },
        reference_type: { type: 'string' },
        service: { type: 'string' },
        enable: { type: 'boolean' },
        options: { type: 'object' },
      },
    };
  }

  /**
   * Relationship mapping.
   */
  static get relationMappings() {
    return {};
  }
}
