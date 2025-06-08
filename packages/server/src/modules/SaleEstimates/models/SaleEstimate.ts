import * as moment from 'moment';
import { Model } from 'objection';
import { TenantBaseModel } from '@/modules/System/models/TenantBaseModel';
import { ExportableModel } from '@/modules/Export/decorators/ExportableModel.decorator';
import { ImportableModel } from '@/modules/Import/decorators/Import.decorator';
import { InjectModelMeta } from '@/modules/Tenancy/TenancyModels/decorators/InjectModelMeta.decorator';
import { SaleEstimateMeta } from './SaleEstimate.meta';
import { ItemEntry } from '@/modules/TransactionItemEntry/models/ItemEntry';
import { Document } from '@/modules/ChromiumlyTenancy/models/Document';
import { Customer } from '@/modules/Customers/models/Customer';

@ExportableModel()
@ImportableModel()
@InjectModelMeta(SaleEstimateMeta)
export class SaleEstimate extends TenantBaseModel {
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

  public entries!: ItemEntry[];
  public attachments!: Document[];
  public customer!: Customer;

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
  static get relationMappings() {
    const {
      ItemEntry,
    } = require('../../TransactionItemEntry/models/ItemEntry');
    const { Customer } = require('../../Customers/models/Customer');
    const { Branch } = require('../../Branches/models/Branch.model');
    const { Warehouse } = require('../../Warehouses/models/Warehouse.model');
    const { Document } = require('../../ChromiumlyTenancy/models/Document');
    const {
      PdfTemplateModel,
    } = require('../../PdfTemplate/models/PdfTemplate');

    return {
      customer: {
        relation: Model.BelongsToOneRelation,
        modelClass: Customer,
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
        modelClass: ItemEntry,
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
        modelClass: Branch,
        join: {
          from: 'sales_estimates.branchId',
          to: 'branches.id',
        },
      },

      /**
       * Sale estimate may has associated warehouse.
       */
      warehouse: {
        relation: Model.BelongsToOneRelation,
        modelClass: Warehouse,
        join: {
          from: 'sales_estimates.warehouseId',
          to: 'warehouses.id',
        },
      },

      /**
       * Sale estimate transaction may has many attached attachments.
       */
      attachments: {
        relation: Model.ManyToManyRelation,
        modelClass: Document,
        join: {
          from: 'sales_estimates.id',
          through: {
            from: 'document_links.modelId',
            to: 'document_links.documentId',
          },
          to: 'documents.id',
        },
        filter(query) {
          query.where('model_ref', 'SaleEstimate');
        },
      },

      /**
       * Sale estimate may belongs to pdf branding template.
       */
      pdfTemplate: {
        relation: Model.BelongsToOneRelation,
        modelClass: PdfTemplateModel,
        join: {
          from: 'sales_estimates.pdfTemplateId',
          to: 'pdf_templates.id',
        },
      },
    };
  }

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
