import { Model, mixin } from 'objection';
import TenantModel from '@/models/TenantModel';
import CachableQueryBuilder from '@/lib/Cachable/CachableQueryBuilder';
import CachableModel from '@/lib/Cachable/CachableModel';


export default class BillPayment extends mixin(TenantModel, [CachableModel]) {
  /**
   * Table name
   */
  static get tableName() {
    return 'bills_payments';
  }

  /**
   * Timestamps columns.
   */
  get timestamps() {
    return ['createdAt', 'updatedAt'];
  }

  /**
   * Extend query builder model.
   */
  static get QueryBuilder() {
    return CachableQueryBuilder;
  }

  static changePaymentAmount(billId, amount) {
    const changeMethod = amount > 0 ? 'increment' : 'decrement';
    return this.tenant()
      .query()
      .where('id', billId)
      [changeMethod]('payment_amount', Math.abs(amount));
  }

  /**
   * Relationship mapping.
   */
  static get relationMappings() {
    const BillPaymentEntry = require('@/models/BillPaymentEntry');

    return {
      /**
       * Account model may belongs to account type.
       */
      entries: {
        relation: Model.BelongsToOneRelation,
        modelClass: this.relationBindKnex(BillPaymentEntry.default),
        join: {
          from: 'bills_payments.id',
          to: 'bills_payments_entries.billPaymentId',
        },
      },
    };
  }
}
