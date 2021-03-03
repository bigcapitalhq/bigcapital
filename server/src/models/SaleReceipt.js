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
   * Virtual attributes.
   */
  static get virtualAttributes() {
    return [
      'isClosed',
      'isDraft',
    ];
  }

  /**
   * Detarmine whether the sale receipt closed.
   * @return {boolean}
   */
  get isClosed() {
    return !!this.closedAt;
  }

  /**
   * Detarmines whether the sale receipt drafted.
   * @return {boolean}
   */
  get isDraft() {
    return !this.closedAt;
  }

  /**
   * Model modifiers.
   */
  static get modifiers() {
    return {
      /**
       * Filters the closed receipts.
       */
      closed(query) {
        query.whereNot('closed_at', null);
      },

      /**
       * Filters the invoices in draft status.
       */
      draft(query) {
        query.where('closed_at', null);
      },
    };
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
      amount: {
        label: 'Amount',
        column: 'amount',
        columnType: 'number',
        fieldType: 'number',
      },
      deposit_account: {
        column: 'deposit_account_id',
        label: 'Deposit account',
        relation: "accounts.id",
        optionsResource: "account",
      },
      customer: {
        label: 'Customer',
        column: 'customer_id',
        fieldType: 'options',
        optionsResource: 'customers',
        optionsKey: 'id',
        optionsLable: 'displayName',
      },
      receipt_date: {
        label: 'Receipt date',
        column: 'receipt_date',
        columnType: 'date',
        fieldType: 'date',
      },
      receipt_number: {
        label: 'Receipt No.',
        column: 'receipt_number',
        columnType: 'string',
        fieldType: 'text',
      },
      reference_no: {
        label: 'Reference No.',
        column: 'reference_no',
        columnType: 'text',
        fieldType: 'text',
      },
      receipt_message: {
        label: 'Receipt message',
        column: 'receipt_message',
        columnType: 'text',
        fieldType: 'text',
      },
      statement: {
        label: 'Statement',
        column: 'statement',
        columnType: 'text',
        fieldType: 'text',
      },
      created_at: {
        label: 'Created at',
        column: 'created_at',
        columnType: 'date',
      },
      status: {
        label: 'Status',
        options: [
          { key: 'draft', label: 'Draft', },
          { key: 'closed', label: 'Closed' },
        ],
        query: (query, role) => {
          switch(role.value) {
            case 'draft':
              query.modify('draft');
              break;
            case 'closed':
              query.modify('closed');
              break;
          }
        },
      }
    };
  }
}
