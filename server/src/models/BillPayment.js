import { Model, mixin } from 'objection';
import TenantModel from 'models/TenantModel';
import ModelSetting from './ModelSetting';
import BillPaymentSettings from './BillPayment.Settings';
import CustomViewBaseModel from './CustomViewBaseModel';
import { DEFAULT_VIEWS } from 'services/Sales/PaymentReceives/constants';

export default class BillPayment extends mixin(TenantModel, [
  ModelSetting,
  CustomViewBaseModel,
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

    return {
      entries: {
        relation: Model.HasManyRelation,
        modelClass: BillPaymentEntry.default,
        join: {
          from: 'bills_payments.id',
          to: 'bills_payments_entries.billPaymentId',
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
    };
  }

  /**
   * Retrieve the default custom views, roles and columns.
   */
  static get defaultViews() {
    return DEFAULT_VIEWS;
  }
}
