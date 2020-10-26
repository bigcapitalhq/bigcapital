import { Model } from 'objection';
import TenantModel from 'models/TenantModel';

export default class PaymentReceive extends TenantModel {
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

  static get resourceable() {
    return true;
  }

  /**
   * Relationship mapping.
   */
  static get relationMappings() {
    const PaymentReceiveEntry = require('models/PaymentReceiveEntry');
    const AccountTransaction = require('models/AccountTransaction');
    const Contact = require('models/Contact');
    const Account = require('models/Account');

    return {
      customer: {
        relation: Model.BelongsToOneRelation,
        modelClass: Contact.default,
        join: {
          from: 'payment_receives.customerId',
          to: 'contacts.id',
        },
        filter(query) {
          query.where('contact_type', 'Customer');
        }
      },

      depositAccount: {
        relation: Model.BelongsToOneRelation,
        modelClass: Account.default,
        join: {
          from: 'payment_receives.depositAccountId',
          to: 'accounts.id',
        },
      },

      entries: {
        relation: Model.HasManyRelation,
        modelClass: PaymentReceiveEntry.default,
        join: {
          from: 'payment_receives.id',
          to: 'payment_receives_entries.paymentReceiveId',
        },
      },

      transactions: {
        relation: Model.HasManyRelation,
        modelClass: AccountTransaction.default,
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

  /**
   * Model defined fields.
   */
  static get fields() {
    return {
      created_at: {
        label: 'Created at',
        column: 'created_at',
        columnType: 'date',
      },
    };
  }
}
