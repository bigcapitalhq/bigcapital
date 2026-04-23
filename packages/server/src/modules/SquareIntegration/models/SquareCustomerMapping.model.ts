import { Model } from 'objection';
import { BaseModel } from '@/models/Model';

export class SquareCustomerMapping extends BaseModel {
  public connectionId!: number;
  public squareCustomerId!: string;
  public customerId!: number;
  public autoCreated!: boolean;

  static get tableName() {
    return 'square_customer_mappings';
  }

  get timestamps() {
    return ['createdAt', 'updatedAt'];
  }

  static get relationMappings() {
    const { Customer } = require('@/modules/Customers/models/Customer');
    const {
      SquareConnection,
    } = require('./SquareConnection.model');
    return {
      customer: {
        relation: Model.BelongsToOneRelation,
        modelClass: Customer,
        join: {
          from: 'square_customer_mappings.customerId',
          to: 'contacts.id',
        },
      },
      connection: {
        relation: Model.BelongsToOneRelation,
        modelClass: SquareConnection,
        join: {
          from: 'square_customer_mappings.connectionId',
          to: 'square_connections.id',
        },
      },
    };
  }
}
