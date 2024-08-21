import { Model, mixin } from 'objection';
import TenantModel from 'models/TenantModel';
import ModelSetting from './ModelSetting';
import BillPaymentSettings from './BillPayment.Settings';
import CustomViewBaseModel from './CustomViewBaseModel';
import { DEFAULT_VIEWS } from '@/services/Sales/PaymentReceived/constants';
import ModelSearchable from './ModelSearchable';

export default class BillPayment extends mixin(TenantModel, [
  ModelSetting,
  CustomViewBaseModel,
  ModelSearchable,
]) {
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
   * Virtual attributes.
   */
  static get virtualAttributes() {
    return ['localAmount'];
  }

  /**
   * Payment amount in local currency.
   * @returns {number}
   */
  get localAmount() {
    return this.amount * this.exchangeRate;
  }

  /**
   * Model settings.
   */
  static get meta() {
    return BillPaymentSettings;
  }

  /**
   * Relationship mapping.
   */
  static get relationMappings() {
    const BillPaymentEntry = require('models/BillPaymentEntry');
    const AccountTransaction = require('models/AccountTransaction');
    const Vendor = require('models/Vendor');
    const Account = require('models/Account');
    const Branch = require('models/Branch');
    const Document = require('models/Document');

    return {
      entries: {
        relation: Model.HasManyRelation,
        modelClass: BillPaymentEntry.default,
        join: {
          from: 'bills_payments.id',
          to: 'bills_payments_entries.billPaymentId',
        },
        filter: (query) => {
          query.orderBy('index', 'ASC');
        },
      },

      vendor: {
        relation: Model.BelongsToOneRelation,
        modelClass: Vendor.default,
        join: {
          from: 'bills_payments.vendorId',
          to: 'contacts.id',
        },
        filter(query) {
          query.where('contact_service', 'vendor');
        },
      },

      paymentAccount: {
        relation: Model.BelongsToOneRelation,
        modelClass: Account.default,
        join: {
          from: 'bills_payments.paymentAccountId',
          to: 'accounts.id',
        },
      },

      transactions: {
        relation: Model.HasManyRelation,
        modelClass: AccountTransaction.default,
        join: {
          from: 'bills_payments.id',
          to: 'accounts_transactions.referenceId',
        },
        filter(builder) {
          builder.where('reference_type', 'BillPayment');
        },
      },

      /**
       * Bill payment may belongs to branch.
       */
      branch: {
        relation: Model.BelongsToOneRelation,
        modelClass: Branch.default,
        join: {
          from: 'bills_payments.branchId',
          to: 'branches.id',
        },
      },

      /**
       * Bill payment may has many attached attachments.
       */
      attachments: {
        relation: Model.ManyToManyRelation,
        modelClass: Document.default,
        join: {
          from: 'bills_payments.id',
          through: {
            from: 'document_links.modelId',
            to: 'document_links.documentId',
          },
          to: 'documents.id',
        },
        filter(query) {
          query.where('model_ref', 'BillPayment');
        },
      },
    };
  }

  /**
   * Retrieve the default custom views, roles and columns.
   */
  static get defaultViews() {
    return DEFAULT_VIEWS;
  }

  /**
   * Model search attributes.
   */
  static get searchRoles() {
    return [
      { fieldKey: 'payment_number', comparator: 'contains' },
      { condition: 'or', fieldKey: 'reference_no', comparator: 'contains' },
      { condition: 'or', fieldKey: 'amount', comparator: 'equals' },
    ];
  }

  /**
   * Prevents mutate base currency since the model is not empty.
   */
  static get preventMutateBaseCurrency() {
    return true;
  }
}
