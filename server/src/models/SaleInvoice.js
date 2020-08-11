import { Model, mixin } from 'objection';
import moment from 'moment';
import TenantModel from '@/models/TenantModel';
import CachableQueryBuilder from '@/lib/Cachable/CachableQueryBuilder';
import CachableModel from '@/lib/Cachable/CachableModel';

export default class SaleInvoice extends mixin(TenantModel, [CachableModel]) {
  /**
   * Virtual attributes.
   */
  static get virtualAttributes() {
    return ['dueAmount'];
  }

  /**
   * Table name
   */
  static get tableName() {
    return 'sales_invoices';
  }

  /**
   * Timestamps columns.
   */
  get timestamps() {
    return ['created_at', 'updated_at'];
  }

  /**
   * Due amount of the given.
   */
  get dueAmount() {
    return Math.max(this.balance - this.paymentAmount, 0);
  }

  /**
   * Relationship mapping.
   */
  static get relationMappings() {
    const AccountTransaction = require('@/models/AccountTransaction');
    const ItemEntry = require('@/models/ItemEntry');
    const Customer = require('@/models/Customer');

    return {
      entries: {
        relation: Model.HasManyRelation,
        modelClass: this.relationBindKnex(ItemEntry.default),
        join: {
          from: 'sales_invoices.id',
          to: 'items_entries.referenceId',
        },
        filter(builder) {
          builder.where('reference_type', 'SaleInvoice');
        },
      },

      customer: {
        relation: Model.BelongsToOneRelation,
        modelClass: this.relationBindKnex(Customer.default),
        join: {
          from: 'sales_invoices.customerId',
          to: 'customers.id',
        },
      },

      transactions: {
        relation: Model.HasManyRelation,
        modelClass: this.relationBindKnex(AccountTransaction.default),
        join: {
          from: 'sales_invoices.id',
          to: 'accounts_transactions.referenceId'
        },
        filter(builder) {
          builder.where('reference_type', 'SaleInvoice');
        },
      }
    };
  }

  /**
   * Change payment amount.
   * @param {Integer} invoiceId 
   * @param {Numeric} amount 
   */
  static async changePaymentAmount(invoiceId, amount) {
    const changeMethod = amount > 0 ? 'increment' : 'decrement';

    await this.tenant()
      .query()
      .where('id', invoiceId)
      [changeMethod]('payment_amount', Math.abs(amount));      
  }


}
