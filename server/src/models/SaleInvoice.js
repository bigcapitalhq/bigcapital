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
    const ItemEntry = require('@/models/ItemEntry');

    return {
      entries: {
        relation: Model.HasManyRelation,
        modelClass: this.relationBindKnex(ItemEntry.default),
        join: {
          from: 'sales_invoices.id',
          to: 'items_entries.referenceId',
        },
      },
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
