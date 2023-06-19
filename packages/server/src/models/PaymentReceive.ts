import { Model, mixin } from 'objection';
import TenantModel from 'models/TenantModel';
import ModelSetting from './ModelSetting';
import PaymentReceiveSettings from './PaymentReceive.Settings';
import CustomViewBaseModel from './CustomViewBaseModel';
import { DEFAULT_VIEWS } from '@/services/Sales/PaymentReceives/constants';
import ModelSearchable from './ModelSearchable';

export default class PaymentReceive extends mixin(TenantModel, [
  ModelSetting,
  CustomViewBaseModel,
  ModelSearchable,
]) {
  /**
   * Table name.
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
   * Virtual attributes.
   */
  static get virtualAttributes() {
    return ['localAmount'];
  }

  /**
   * Payment receive amount in local currency.
   * @returns {number}
   */
  get localAmount() {
    return this.amount * this.exchangeRate;
  }

  /**
   * Resourceable model.
   */
  static get resourceable() {
    return true;
  }

  /*
   * Relationship mapping.
   */
  static get relationMappings() {
    const PaymentReceiveEntry = require('models/PaymentReceiveEntry');
    const AccountTransaction = require('models/AccountTransaction');
    const Customer = require('models/Customer');
    const Account = require('models/Account');
    const Branch = require('models/Branch');

    return {
      customer: {
        relation: Model.BelongsToOneRelation,
        modelClass: Customer.default,
        join: {
          from: 'payment_receives.customerId',
          to: 'contacts.id',
        },
        filter: (query) => {
          query.where('contact_service', 'customer');
        },
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
        filter: (query) => {
          query.orderBy('index', 'ASC');
        },
      },
      transactions: {
        relation: Model.HasManyRelation,
        modelClass: AccountTransaction.default,
        join: {
          from: 'payment_receives.id',
          to: 'accounts_transactions.referenceId',
        },
        filter: (builder) => {
          builder.where('reference_type', 'PaymentReceive');
        },
      },

      /**
       * Payment receive may belongs to branch.
       */
      branch: {
        relation: Model.BelongsToOneRelation,
        modelClass: Branch.default,
        join: {
          from: 'payment_receives.branchId',
          to: 'branches.id',
        },
      },
    };
  }

  /**
   *
   */
  static get meta() {
    return PaymentReceiveSettings;
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
      { fieldKey: 'payment_receive_no', comparator: 'contains' },
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
