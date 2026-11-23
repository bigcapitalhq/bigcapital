import { Model } from 'objection';
import { sumBy } from 'lodash';
import { DiscountType } from '@/common/types/Discount';
import { TenantBaseModel } from '@/modules/System/models/TenantBaseModel';
import { InjectModelMeta } from '@/modules/Tenancy/TenancyModels/decorators/InjectModelMeta.decorator';
import { InjectModelDefaultViews } from '@/modules/Views/decorators/InjectModelDefaultViews.decorator';
import { ItemEntry } from '@/modules/TransactionItemEntry/models/ItemEntry';
import { Customer } from '@/modules/Customers/models/Customer';
import { Branch } from '@/modules/Branches/models/Branch.model';
import { Warehouse } from '@/modules/Warehouses/models/Warehouse.model';
import { PdfTemplateModel } from '@/modules/PdfTemplate/models/PdfTemplate';
import { SaleInvoice } from '@/modules/SaleInvoices/models/SaleInvoice';
import { sanitizeSortDirection } from '@/modules/DynamicListing/DynamicFilter/sanitizeSortDirection';
import { ISearchRole } from '@/modules/DynamicListing/DynamicFilter/DynamicFilter.types';
import { RecurringInvoiceMeta } from './RecurringInvoice.meta';
import { RecurringInvoiceDefaultViews } from '../constants';
import {
  RECURRING_INVOICE_REFERENCE_TYPE,
  RecurringInvoiceDeliveryMode,
  RecurringInvoiceFrequency,
  RecurringInvoiceStatus,
} from '../RecurringInvoice.types';

@InjectModelMeta(RecurringInvoiceMeta)
@InjectModelDefaultViews(RecurringInvoiceDefaultViews)
export class RecurringInvoice extends TenantBaseModel {
  public id: number;
  public customerId: number;
  public profileName: string;
  public referenceNo: string;

  public invoiceMessage: string;
  public termsConditions: string;

  public currencyCode: string;
  public exchangeRate: number;

  public discount: number;
  public discountType: DiscountType;
  public adjustment: number;
  public isInclusiveTax: boolean;

  public branchId: number;
  public warehouseId: number;
  public pdfTemplateId: number;
  public userId: number;

  public status: RecurringInvoiceStatus;
  public frequency: RecurringInvoiceFrequency;
  public repeatInterval: number;

  public startDate: string;
  public endDate: string | null;
  public maxOccurrences: number | null;
  public occurrencesCount: number;

  public nextInvoiceDate: string | null;
  public lastInvoiceDate: string | null;
  public dueDays: number;

  public deliveryMode: RecurringInvoiceDeliveryMode;
  public emailSubject: string | null;
  public emailMessage: string | null;
  public emailCc: string[] | null;
  public emailBcc: string[] | null;
  public attachInvoice: boolean;

  public failureCount: number;
  public lastError: string | null;

  public createdAt: Date;
  public updatedAt: Date;

  public customer?: Customer;
  public entries?: ItemEntry[];
  public branch?: Branch;
  public warehouse?: Warehouse;
  public pdfTemplate?: PdfTemplateModel;
  public invoices?: SaleInvoice[];

  /**
   * Table name.
   */
  static get tableName() {
    return 'recurring_invoices';
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
      'isActive',
      'isPaused',
      'isCompleted',
      'subtotal',
      'taxAmount',
      'discountAmount',
      'total',
      'amount',
    ];
  }

  get isActive(): boolean {
    return this.status === RecurringInvoiceStatus.Active;
  }

  get isPaused(): boolean {
    return this.status === RecurringInvoiceStatus.Paused;
  }

  get isCompleted(): boolean {
    return this.status === RecurringInvoiceStatus.Completed;
  }

  get subtotal(): number {
    return sumBy(this.entries || [], (entry) => entry.amount);
  }

  get taxAmount(): number {
    return sumBy(this.entries || [], (entry) => entry.taxAmount);
  }

  get discountAmount(): number {
    const discount = Number(this.discount) || 0;

    return this.discountType === DiscountType.Amount
      ? discount
      : this.subtotal * (discount / 100);
  }

  get total(): number {
    const adjustment = Number(this.adjustment) || 0;
    const taxAmount = this.isInclusiveTax ? 0 : this.taxAmount;

    return this.subtotal - this.discountAmount + adjustment + taxAmount;
  }

  get amount(): number {
    return this.subtotal;
  }

  /**
   * Model modifiers.
   */
  static get modifiers() {
    return {
      active(query) {
        query.where('status', RecurringInvoiceStatus.Active);
      },
      paused(query) {
        query.where('status', RecurringInvoiceStatus.Paused);
      },
      completed(query) {
        query.where('status', RecurringInvoiceStatus.Completed);
      },
      due(query, today: string) {
        query.where('status', RecurringInvoiceStatus.Active);
        query.where('next_invoice_date', '<=', today);
      },
      filterByStatus(query, status: string) {
        query.where('status', status);
      },
      sortByStatus(query, order) {
        const direction = sanitizeSortDirection(order);
        query.orderByRaw(
          `CASE status
            WHEN 'active' THEN 1
            WHEN 'paused' THEN 2
            WHEN 'completed' THEN 3
            ELSE 4
          END ${direction}`,
        );
      },
    };
  }

  /**
   * Relationship mappings.
   */
  static get relationMappings() {
    return {
      entries: {
        relation: Model.HasManyRelation,
        modelClass: ItemEntry,
        join: {
          from: 'recurring_invoices.id',
          to: 'items_entries.referenceId',
        },
        filter(builder) {
          builder.where('reference_type', RECURRING_INVOICE_REFERENCE_TYPE);
          builder.orderBy('index', 'ASC');
        },
      },

      customer: {
        relation: Model.BelongsToOneRelation,
        modelClass: Customer,
        join: {
          from: 'recurring_invoices.customerId',
          to: 'contacts.id',
        },
        filter(query) {
          query.where('contact_service', 'Customer');
        },
      },

      branch: {
        relation: Model.BelongsToOneRelation,
        modelClass: Branch,
        join: {
          from: 'recurring_invoices.branchId',
          to: 'branches.id',
        },
      },

      warehouse: {
        relation: Model.BelongsToOneRelation,
        modelClass: Warehouse,
        join: {
          from: 'recurring_invoices.warehouseId',
          to: 'warehouses.id',
        },
      },

      pdfTemplate: {
        relation: Model.BelongsToOneRelation,
        modelClass: PdfTemplateModel,
        join: {
          from: 'recurring_invoices.pdfTemplateId',
          to: 'pdf_templates.id',
        },
      },

      invoices: {
        relation: Model.HasManyRelation,
        modelClass: SaleInvoice,
        join: {
          from: 'recurring_invoices.id',
          to: 'sales_invoices.recurringInvoiceId',
        },
      },
    };
  }

  /**
   * Model searchable.
   */
  static get searchable() {
    return true;
  }

  /**
   * Model search roles.
   */
  static get searchRoles(): ISearchRole[] {
    return [{ fieldKey: 'profile_name', comparator: 'contains' }];
  }
}
