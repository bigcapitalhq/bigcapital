import { Model, mixin } from 'objection';
import TenantModel from 'models/TenantModel';

export default class SaleReceipt extends TenantModel {
  /**
   * Table name
   */
  static get tableName() {
    return 'sales_receipts';
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
    const Contact = require('models/Contact');
    const Account = require('models/Account');
    const AccountTransaction = require('models/AccountTransaction');
    const ItemEntry = require('models/ItemEntry');

    return {
      customer: {
        relation: Model.BelongsToOneRelation,
        modelClass: Contact.default,
        join: {
          from: 'sales_receipts.customerId',
          to: 'contacts.id',
        },
        filter(query) {
          query.where('contact_service', 'customer');
        }
      },

      depositAccount: {
        relation: Model.BelongsToOneRelation,
        modelClass: Account.default,
        join: {
          from: 'sales_receipts.depositAccountId',
          to: 'accounts.id',
        },
      },

      entries: {
        relation: Model.HasManyRelation,
        modelClass: ItemEntry.default,
        join: {
          from: 'sales_receipts.id',
          to: 'items_entries.referenceId',
        },
        filter(builder) {
          builder.where('reference_type', 'SaleReceipt');
        },
      },

      transactions: {
        relation: Model.HasManyRelation,
        modelClass: AccountTransaction.default,
        join: {
          from: 'sales_receipts.id',
          to: 'accounts_transactions.referenceId'
        },
        filter(builder) {
          builder.where('reference_type', 'SaleReceipt');
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
