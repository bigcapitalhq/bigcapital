import { Model, raw } from 'objection';
import { DiscountType } from '@/common/types/Discount';
import { Branch } from '@/modules/Branches/models/Branch.model';
import { Customer } from '@/modules/Customers/models/Customer';
import { ExportableModel } from '@/modules/Export/decorators/ExportableModel.decorator';
import { ImportableModel } from '@/modules/Import/decorators/Import.decorator';
import { TenantBaseModel } from '@/modules/System/models/TenantBaseModel';
import { InjectModelMeta } from '@/modules/Tenancy/TenancyModels/decorators/InjectModelMeta.decorator';
import { ItemEntry } from '@/modules/TransactionItemEntry/models/ItemEntry';
import { Warehouse } from '@/modules/Warehouses/models/Warehouse.model';
import { CreditNoteMeta } from './CreditNote.meta';
import { InjectModelDefaultViews } from '@/modules/Views/decorators/InjectModelDefaultViews.decorator';
import { CreditNoteDefaultViews } from '../constants';

@ExportableModel()
@ImportableModel()
@InjectModelMeta(CreditNoteMeta)
@InjectModelDefaultViews(CreditNoteDefaultViews)
export class CreditNote extends TenantBaseModel {
  public amount: number;
  public exchangeRate: number;
  public openedAt: Date;
  public discount: number;
  public discountType: DiscountType;
  public adjustment: number;
  public refundedAmount: number;
  public invoicesAmount: number;
  public creditNoteDate: Date;
  public creditNoteNumber: string;
  public referenceNo: string;
  public currencyCode: string;
  public customerId: number;

  public userId: number;

  public branchId: number;
  public warehouseId: number;

  public customer!: Customer;
  public entries!: ItemEntry[];

  public branch!: Branch;
  public warehouse!: Warehouse;

  public createdAt!: Date | string;
  public updatedAt!: Date | string;

  /**
   * Table name
   */
  static get tableName() {
    return 'credit_notes';
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
      'localAmount',
      'isDraft',
      'isPublished',
      'isOpen',
      'isClosed',

      'creditsRemaining',
      'creditsUsed',

      'subtotal',
      'subtotalLocal',

      'discountAmount',
      'discountAmountLocal',
      'discountPercentage',

      'total',
      'totalLocal',

      'adjustmentLocal',
    ];
  }

  /**
   * Credit note amount in local currency.
   * @returns {number}
   */
  get localAmount() {
    return this.amount * this.exchangeRate;
  }

  /**
   * Credit note subtotal.
   * @returns {number}
   */
  get subtotal() {
    return this.amount;
  }

  /**
   * Credit note subtotal in local currency.
   * @returns {number}
   */
  get subtotalLocal() {
    return this.subtotal * this.exchangeRate;
  }

  /**
   * Discount amount.
   * @returns {number}
   */
  get discountAmount() {
    return this.discountType === DiscountType.Amount
      ? this.discount
      : this.subtotal * (this.discount / 100);
  }

  /**
   * Discount amount in local currency.
   * @returns {number}
   */
  get discountAmountLocal() {
    return this.discountAmount ? this.discountAmount * this.exchangeRate : null;
  }

  /**
   * Discount percentage.
   * @returns {number | null}
   */
  get discountPercentage(): number | null {
    return this.discountType === DiscountType.Percentage ? this.discount : null;
  }

  /**
   * Adjustment amount in local currency.
   * @returns {number}
   */
  get adjustmentLocal() {
    return this.adjustment ? this.adjustment * this.exchangeRate : null;
  }

  /**
   * Credit note total.
   * @returns {number}
   */
  get total() {
    return this.subtotal - this.discountAmount + this.adjustment;
  }

  /**
   * Credit note total in local currency.
   * @returns {number}
   */
  get totalLocal() {
    return this.total * this.exchangeRate;
  }

  /**
   * Detarmines whether the credit note is draft.
   * @returns {boolean}
   */
  get isDraft() {
    return !this.openedAt;
  }

  /**
   * Detarmines whether vendor credit is published.
   * @returns {boolean}
   */
  get isPublished() {
    return !!this.openedAt;
  }

  /**
   * Detarmines whether the credit note is open.
   * @return {boolean}
   */
  get isOpen() {
    return !!this.openedAt && this.creditsRemaining > 0;
  }

  /**
   * Detarmines whether the credit note is closed.
   * @return {boolean}
   */
  get isClosed() {
    return this.openedAt && this.creditsRemaining === 0;
  }

  /**
   * Retrieve the credits remaining.
   */
  get creditsRemaining() {
    return Math.max(this.amount - this.refundedAmount - this.invoicesAmount, 0);
  }

  /**
   * Retrieve the credits used.
   */
  get creditsUsed() {
    return this.refundedAmount + this.invoicesAmount;
  }

  /**
   * Model modifiers.
   */
  static get modifiers() {
    return {
      /**
       * Filters the credit notes in draft status.
       */
      draft(query) {
        query.where('opened_at', null);
      },

      /**
       * Filters the.
       */
      published(query) {
        query.whereNot('opened_at', null);
      },

      /**
       * Filters the open credit notes.
       */
      open(query) {
        query
          .where(
            raw(`COALESCE(REFUNDED_AMOUNT) + COALESCE(INVOICES_AMOUNT) <
            COALESCE(AMOUNT)`),
          )
          .modify('published');
      },

      /**
       * Filters the closed credit notes.
       */
      closed(query) {
        query
          .where(
            raw(`COALESCE(REFUNDED_AMOUNT) + COALESCE(INVOICES_AMOUNT) =
            COALESCE(AMOUNT)`),
          )
          .modify('published');
      },

      /**
       * Status filter.
       */
      filterByStatus(query, filterType) {
        switch (filterType) {
          case 'draft':
            query.modify('draft');
            break;
          case 'published':
            query.modify('published');
            break;
          case 'open':
          default:
            query.modify('open');
            break;
          case 'closed':
            query.modify('closed');
            break;
        }
      },

      /**
       *
       */
      sortByStatus(query, order) {
        query.orderByRaw(
          `COALESCE(REFUNDED_AMOUNT) + COALESCE(INVOICES_AMOUNT) = COALESCE(AMOUNT) ${order}`,
        );
      },
    };
  }

  /**
   * Relationship mapping.
   */
  static get relationMappings() {
    const {
      AccountTransaction,
    } = require('../../Accounts/models/AccountTransaction.model');
    const {
      ItemEntry,
    } = require('../../TransactionItemEntry/models/ItemEntry');
    const { Customer } = require('../../Customers/models/Customer');
    const { Branch } = require('../../Branches/models/Branch.model');
    const { Document } = require('../../ChromiumlyTenancy/models/Document');
    const { Warehouse } = require('../../Warehouses/models/Warehouse.model');
    const {
      PdfTemplateModel,
    } = require('../../PdfTemplate/models/PdfTemplate');

    return {
      /**
       * Credit note associated entries.
       */
      entries: {
        relation: Model.HasManyRelation,
        modelClass: ItemEntry,
        join: {
          from: 'credit_notes.id',
          to: 'items_entries.referenceId',
        },
        filter(builder) {
          builder.where('reference_type', 'CreditNote');
          builder.orderBy('index', 'ASC');
        },
      },

      /**
       * Belongs to customer model.
       */
      customer: {
        relation: Model.BelongsToOneRelation,
        modelClass: Customer,
        join: {
          from: 'credit_notes.customerId',
          to: 'contacts.id',
        },
        filter(query) {
          query.where('contact_service', 'Customer');
        },
      },

      /**
       * Credit note associated GL entries.
       */
      transactions: {
        relation: Model.HasManyRelation,
        modelClass: AccountTransaction,
        join: {
          from: 'credit_notes.id',
          to: 'accounts_transactions.referenceId',
        },
        filter(builder) {
          builder.where('reference_type', 'CreditNote');
        },
      },

      /**
       * Credit note may belongs to branch.
       */
      branch: {
        relation: Model.BelongsToOneRelation,
        modelClass: Branch,
        join: {
          from: 'credit_notes.branchId',
          to: 'branches.id',
        },
      },

      /**
       * Credit note may has associated warehouse.
       */
      warehouse: {
        relation: Model.BelongsToOneRelation,
        modelClass: Warehouse,
        join: {
          from: 'credit_notes.warehouseId',
          to: 'warehouses.id',
        },
      },

      /**
       * Credit note may has many attached attachments.
       */
      attachments: {
        relation: Model.ManyToManyRelation,
        modelClass: Document,
        join: {
          from: 'credit_notes.id',
          through: {
            from: 'document_links.modelId',
            to: 'document_links.documentId',
          },
          to: 'documents.id',
        },
        filter(query) {
          query.where('model_ref', 'CreditNote');
        },
      },

      /**
       * Credit note may belongs to pdf branding template.
       */
      pdfTemplate: {
        relation: Model.BelongsToOneRelation,
        modelClass: PdfTemplateModel,
        join: {
          from: 'credit_notes.pdfTemplateId',
          to: 'pdf_templates.id',
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
   * Model search attributes.
   */
  static get searchRoles() {
    return [
      { fieldKey: 'credit_number', comparator: 'contains' },
      { condition: 'or', fieldKey: 'reference_no', comparator: 'contains' },
      { condition: 'or', fieldKey: 'amount', comparator: 'equals' },
    ];
  }

  /**
   * Prevents mutate base currency since the model is not empty.
   * @returns {boolean}
   */
  static get preventMutateBaseCurrency() {
    return true;
  }
}
