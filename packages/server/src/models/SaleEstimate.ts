import moment from 'moment';
import { Model, mixin } from 'objection';
import TenantModel from 'models/TenantModel';
import { defaultToTransform } from 'utils';
import SaleEstimateSettings from './SaleEstimate.Settings';
import ModelSetting from './ModelSetting';
import CustomViewBaseModel from './CustomViewBaseModel';
import { DEFAULT_VIEWS } from '@/services/Sales/Estimates/constants';
import ModelSearchable from './ModelSearchable';

export default class SaleEstimate extends mixin(TenantModel, [
  ModelSetting,
  CustomViewBaseModel,
  ModelSearchable,
]) {
  /**
   * Table name
   */
  static get tableName() {
    return 'sales_estimates';
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
    return [
      'localAmount',
      'isDelivered',
      'isExpired',
      'isConvertedToInvoice',
      'isApproved',
      'isRejected',
    ];
  }

  /**
   * Estimate amount in local currency.
   * @returns {number}
   */
  get localAmount() {
    return this.amount * this.exchangeRate;
  }

  /**
   * Determines whether the sale estimate converted to sale invoice.
   * @return {boolean}
   */
  get isConvertedToInvoice() {
    return !!(this.convertedToInvoiceId && this.convertedToInvoiceAt);
  }

  /**
   * Determines whether the estimate is delivered.
   * @return {boolean}
   */
  get isDelivered() {
    return !!this.deliveredAt;
  }

  /**
   * Determines whether the estimate is expired.
   * @return {boolean}
   */
  get isExpired() {
    return defaultToTransform(
      this.expirationDate,
      moment().isAfter(this.expirationDate, 'day'),
      false
    );
  }

  /**
   * Determines whether the estimate is approved.
   * @return {boolean}
   */
  get isApproved() {
    return !!this.approvedAt;
  }

  /**
   * Determines whether the estimate is reject.
   * @return {boolean}
   */
  get isRejected() {
    return !!this.rejectedAt;
  }

  /**
   * Allows to mark model as resourceable to viewable and filterable.
   */
  static get resourceable() {
    return true;
  }

  /**
   * Model modifiers.
   */
  static get modifiers() {
    return {
      /**
       * Filters the drafted estimates transactions.
       */
      draft(query) {
        query.where('delivered_at', null);
      },
      /**
       * Filters the delivered estimates transactions.
       */
      delivered(query) {
        query.whereNot('delivered_at', null);
      },
      /**
       * Filters the expired estimates transactions.
       */
      expired(query) {
        query.where('expiration_date', '<', moment().format('YYYY-MM-DD'));
      },
      /**
       * Filters the rejected estimates transactions.
       */
      rejected(query) {
        query.whereNot('rejected_at', null);
      },
      /**
       * Filters the invoiced estimates transactions.
       */
      invoiced(query) {
        query.whereNot('converted_to_invoice_at', null);
      },
      /**
       * Filters the approved estimates transactions.
       */
      approved(query) {
        query.whereNot('approved_at', null);
      },
      /**
       * Sorting the estimates orders by delivery status.
       */
      orderByStatus(query, order) {
        query.orderByRaw(`delivered_at is null ${order}`);
      },
      /**
       * Filtering the estimates oreders by status field.
       */
      filterByStatus(query, filterType) {
        switch (filterType) {
          case 'draft':
            query.modify('draft');
            break;
          case 'delivered':
            query.modify('delivered');
            break;
          case 'approved':
            query.modify('approved');
            break;
          case 'rejected':
            query.modify('rejected');
            break;
          case 'invoiced':
            query.modify('invoiced');
            break;
          case 'expired':
            query.modify('expired');
            break;
        }
      },
    };
  }

  /**
   * Relationship mapping.
   */
  static get relationMappings() {
    const ItemEntry = require('models/ItemEntry');
    const Customer = require('models/Customer');
    const Branch = require('models/Branch');

    return {
      customer: {
        relation: Model.BelongsToOneRelation,
        modelClass: Customer.default,
        join: {
          from: 'sales_estimates.customerId',
          to: 'contacts.id',
        },
        filter(query) {
          query.where('contact_service', 'customer');
        },
      },
      entries: {
        relation: Model.HasManyRelation,
        modelClass: ItemEntry.default,
        join: {
          from: 'sales_estimates.id',
          to: 'items_entries.referenceId',
        },
        filter(builder) {
          builder.where('reference_type', 'SaleEstimate');
          builder.orderBy('index', 'ASC');
        },
      },

      /**
       * Sale estimate may belongs to branch.
       */
      branch: {
        relation: Model.BelongsToOneRelation,
        modelClass: Branch.default,
        join: {
          from: 'sales_estimates.branchId',
          to: 'branches.id',
        },
      },
    };
  }

  /**
   * Model settings.
   */
  static get meta() {
    return SaleEstimateSettings;
  }

  /**
   * Retrieve the default custom views, roles and columns.
   */
  static get defaultViews() {
    return DEFAULT_VIEWS;
  }

  /**
   * Model search roles.
   */
  static get searchRoles() {
    return [
      { fieldKey: 'amount', comparator: 'equals' },
      { condition: 'or', fieldKey: 'estimate_number', comparator: 'contains' },
      { condition: 'or', fieldKey: 'reference_no', comparator: 'contains' },
    ];
  }

  /**
   * Prevents mutate base currency since the model is not empty.
   */
  static get preventMutateBaseCurrency() {
    return true;
  }
}
