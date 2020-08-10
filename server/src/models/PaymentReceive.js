import { Model, mixin } from 'objection';
import moment from 'moment';
import TenantModel from '@/models/TenantModel';
import CachableQueryBuilder from '@/lib/Cachable/CachableQueryBuilder';
import CachableModel from '@/lib/Cachable/CachableModel';

export default class PaymentReceive extends mixin(TenantModel, [CachableModel]) {
  /**
   * Table name
   */
  static get tableName() {
    return 'payment_receives';
  }

  /**
   * Timestamps columns.
   */
  get timestamps() {
    return ['created_at', 'updated_at'];
  }

  /**
   * Relationship mapping.
   */
  static get relationMappings() {
    const PaymentReceiveEntry = require('@/models/PaymentReceiveEntry');
    const AccountTransaction = require('@/models/AccountTransaction');
    const Customer = require('@/models/Customer');
    const Account = require('@/models/Account');

    return {
      customer: {
        relation: Model.BelongsToOneRelation,
        modelClass: this.relationBindKnex(Customer.default),
        join: {
          from: 'payment_receives.customerId',
          to: 'customers.id',
        },
      },

      depositAccount: {
        relation: Model.BelongsToOneRelation,
        modelClass: this.relationBindKnex(Account.default),
        join: {
          from: 'payment_receives.depositAccountId',
          to: 'accounts.id',
        },
      },

      entries: {
        relation: Model.HasManyRelation,
        modelClass: this.relationBindKnex(PaymentReceiveEntry.default),
        join: {
          from: 'payment_receives.id',
          to: 'payment_receives_entries.paymentReceiveId',
        },
      },

      transactions: {
        relation: Model.HasManyRelation,
        modelClass: this.relationBindKnex(AccountTransaction.default),
        join: {
          from: 'payment_receives.id',
          to: 'accounts_transactions.referenceId'
        },
        filter(builder) {
          builder.where('reference_type', 'PaymentReceive');
        },
      }
    };
  }
}
