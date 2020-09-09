import { Model } from 'objection';
import TenantModel from '@/models/TenantModel';

export default class BillPayment extends TenantModel {
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
    const AccountTransaction = require('@/models/AccountTransaction');
    const Vendor = require('@/models/Vendor');
    const Account = require('@/models/Account');

    return {
      entries: {
        relation: Model.HasManyRelation,
        modelClass: this.relationBindKnex(BillPaymentEntry.default),
        join: {
          from: 'bills_payments.id',
          to: 'bills_payments_entries.billPaymentId',
        },
      },

      vendor: {
        relation: Model.BelongsToOneRelation,
        modelClass: this.relationBindKnex(Vendor.default),
        join: {
          from: 'bills_payments.vendorId',
          to: 'vendors.id',
        },
      },

      paymentAccount: {
        relation: Model.BelongsToOneRelation,
        modelClass: this.relationBindKnex(Account.default),
        join: {
          from: 'bills_payments.paymentAccountId',
          to: 'accounts.id',
        },
      },

      transactions: {
        relation: Model.HasManyRelation,
        modelClass: this.relationBindKnex(AccountTransaction.default),
        join: {
          from: 'bills_payments.id',
          to: 'accounts_transactions.referenceId'
        },
        filter(builder) {
          builder.where('reference_type', 'BillPayment');
        },
      }
    };
  }
}
