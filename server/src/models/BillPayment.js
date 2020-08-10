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
   * Relationship mapping.
   */
  static get relationMappings() {
    const BillPaymentEntry = require('@/models/BillPaymentEntry');
    const Vendor = require('@/models/Vendor');
    const Account = require('@/models/Account');

    return {
      /**
       * 
       */
      entries: {
        relation: Model.HasManyRelation,
        modelClass: this.relationBindKnex(BillPaymentEntry.default),
        join: {
          from: 'bills_payments.id',
          to: 'bills_payments_entries.billPaymentId',
        },
      },

      /**
       * 
       */
      vendor: {
        relation: Model.BelongsToOneRelation,
        modelClass: this.relationBindKnex(Vendor.default),
        join: {
          from: 'bills_payments.vendorId',
          to: 'vendors.id',
        },
      },

      /**
       * 
       */
      paymentAccount: {
        relation: Model.BelongsToOneRelation,
        modelClass: this.relationBindKnex(Account.default),
        join: {
          from: 'bills_payments.paymentAccountId',
          to: 'accounts.id',
        },
      },
    };
  }
}
