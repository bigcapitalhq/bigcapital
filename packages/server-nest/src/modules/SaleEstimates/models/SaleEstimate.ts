import { BaseModel } from '@/models/Model';
import moment from 'moment';
import { Model } from 'objection';
import { ItemEntry } from '../../Items/models/ItemEntry';
import { Customer } from '../../Customers/models/Customer';
import { Branch } from '../../Branches/models/Branch.model';
import { Warehouse } from '../../Warehouses/models/Warehouse.model';
import { Document } from '../../ChromiumlyTenancy/models/Document';
import { Injectable } from '@nestjs/common';

@Injectable()
export class SaleEstimate extends BaseModel {
  exchangeRate!: number;
  amount!: number;

  currencyCode!: string;

  customerId!: number;
  estimateDate!: Date | string;
  expirationDate!: Date | string;
  reference!: string;
  estimateNumber!: string;
  note!: string;
  termsConditions!: string;
  sendToEmail!: string;

  deliveredAt!: Date | string;
  approvedAt!: Date | string;
  rejectedAt!: Date | string;

  userId!: number;

  convertedToInvoiceId!: number;
  convertedToInvoiceAt!: Date | string;

  createdAt?: Date;
  updatedAt?: Date | null;

  branchId?: number;
  warehouseId?: number;

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
   * Detarmines whether the sale estimate converted to sale invoice.
   * @return {boolean}
   */
  get isConvertedToInvoice() {
    return !!(this.convertedToInvoiceId && this.convertedToInvoiceAt);
  }

  /**
   * Detarmines whether the estimate is delivered.
   * @return {boolean}
   */
  get isDelivered() {
    return !!this.deliveredAt;
  }

  /**
   * Detarmines whether the estimate is expired.
   * @return {boolean}
   */
  get isExpired() {
    // return defaultToTransform(
    //   this.expirationDate,
    //   moment().isAfter(this.expirationDate, 'day'),
    //   false
    // );i

    return false;
  }

  /**
   * Detarmines whether the estimate is approved.
   * @return {boolean}
   */
  get isApproved() {
    return !!this.approvedAt;
  }

  /**
   * Detarmines whether the estimate is reject.
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
  // static get relationMappings() {
  //   return {
  //     customer: {
  //       relation: Model.BelongsToOneRelation,
  //       modelClass: this.customerModel,
  //       join: {
  //         from: 'sales_estimates.customerId',
  //         to: 'contacts.id',
  //       },
  //       filter(query) {
  //         query.where('contact_service', 'customer');
  //       },
  //     },
  //     entries: {
  //       relation: Model.HasManyRelation,
  //       modelClass: this.itemEntryModel,
  //       join: {
  //         from: 'sales_estimates.id',
  //         to: 'items_entries.referenceId',
  //       },
  //       filter(builder) {
  //         builder.where('reference_type', 'SaleEstimate');
  //         builder.orderBy('index', 'ASC');
  //       },
  //     },
  //     branch: {
  //       relation: Model.BelongsToOneRelation,
  //       modelClass: this.branchModel,
  //       join: {
  //         from: 'sales_estimates.branchId',
  //         to: 'branches.id',
  //       },
  //     },
  //     warehouse: {
  //       relation: Model.BelongsToOneRelation,
  //       modelClass: this.warehouseModel,
  //       join: {
  //         from: 'sales_estimates.warehouseId',
  //         to: 'warehouses.id',
  //       },
  //     },
  //     attachments: {
  //       relation: Model.ManyToManyRelation,
  //       modelClass: this.documentModel,
  //       join: {
  //         from: 'sales_estimates.id',
  //         through: {
  //           from: 'document_links.modelId',
  //           to: 'document_links.documentId',
  //         },
  //         to: 'documents.id',
  //       },
  //       filter(query) {
  //         query.where('model_ref', 'SaleEstimate');
  //       },
  //     },
  //   };
  // }

  /**
   * Model settings.
   */
  // static get meta() {
  // return SaleEstimateSettings;
  // }

  /**
   * Retrieve the default custom views, roles and columns.
   */
  // static get defaultViews() {
  // return DEFAULT_VIEWS;
  // }

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
