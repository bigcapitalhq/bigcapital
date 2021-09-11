import { Model, mixin } from 'objection';
import TenantModel from 'models/TenantModel';
import ModelSetting from './ModelSetting';
import PaymentReceiveSettings from './PaymentReceive.Settings';
import CustomViewBaseModel from './CustomViewBaseModel';
import { DEFAULT_VIEWS } from 'services/Sales/PaymentReceives/constants';
import ModelSearchable from './ModelSearchable';

export default class PaymentReceive extends mixin(TenantModel, [
  ModelSetting,
  CustomViewBaseModel,
  ModelSearchable
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
   * Resourcable model.
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

    return {
      customer: {
        relation: Model.BelongsToOneRelation,
        modelClass: Customer.default,
        join: {
          from: 'payment_receives.customerId',
          to: 'contacts.id',
        },
        filter(query) {
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
      },
      transactions: {
        relation: Model.HasManyRelation,
        modelClass: AccountTransaction.default,
        join: {
          from: 'payment_receives.id',
          to: 'accounts_transactions.referenceId',
        },
        filter(builder) {
          builder.where('reference_type', 'PaymentReceive');
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
}
