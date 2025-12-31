import { DiscountType } from '@/common/types/Discount';
import { BaseModel } from '@/models/Model';
import { BillLandedCostEntry } from '@/modules/BillLandedCosts/models/BillLandedCostEntry';
import { Item } from '@/modules/Items/models/Item';
import { ItemEntryTax } from '@/modules/TaxRates/models/ItemEntryTax.model';
import {
  getExlusiveTaxAmount,
  getInclusiveTaxAmount,
} from '@/modules/TaxRates/utils';
import { Model } from 'objection';

export class ItemEntry extends BaseModel {
  public referenceType: string;
  public referenceId: string;

  public index: number;
  public itemId: number;
  public description: string;

  public sellAccountId: number;
  public costAccountId: number;

  public quantity: number;
  public rate: number;

  public taxRate: number;
  public isInclusiveTax: number;

  public landedCost: boolean;
  public allocatedCostAmount: number;

  public discountType: DiscountType;
  public discount: number;

  public adjustment: number;

  /** @deprecated Use taxes relation instead */
  public taxRateId: number;

  public warehouseId: number;

  item: Item;
  allocatedCostEntries: BillLandedCostEntry[];
  taxes!: ItemEntryTax[];

  /**
   * Table name.
   * @returns {string}
   */
  static get tableName() {
    return 'items_entries';
  }

  /**
   * Timestamps columns.
   * @returns {string[]}
   */
  get timestamps() {
    return ['created_at', 'updated_at'];
  }

  /**
   * Virtual attributes.
   * @returns {string[]}
   */
  static get virtualAttributes() {
    return [
      // Amount (qty * rate)
      'amount',

      'taxAmount',

      // Total tax amount from multiple taxes
      'totalTaxAmount',

      // Subtotal (qty * rate) + (tax inclusive)
      'subtotalInclusingTax',

      // Subtotal Tax Exclusive (Subtotal - Tax Amount)
      'subtotalExcludingTax',

      // Subtotal (qty * rate) + (tax inclusive)
      'subtotal',

      // Discount (Is percentage ? amount * discount : discount)
      'discountAmount',

      // Total (Subtotal - Discount)
      'total',
    ];
  }

  /**
   * Item entry total.
   * Amount of item entry includes tax and subtracted discount amount.
   * @returns {number}
   */
  get total() {
    return this.subtotal - this.discountAmount;
  }

  /**
   * Total (excluding tax).
   * @returns {number}
   */
  get totalExcludingTax() {
    return this.subtotalExcludingTax - this.discountAmount;
  }

  /**
   * Item entry amount (before discount).
   * Amount of item entry that may include or exclude tax.
   * @returns {number}
   */
  get amount() {
    return this.quantity * this.rate;
  }

  /**
   * Item entry amount after discount.
   * This is the taxable amount.
   * @returns {number}
   */
  get amountAfterDiscount() {
    return this.amount - this.discountAmount;
  }

  /**
   * Subtotal amount (tax inclusive).
   * @returns {number}
   */
  get subtotal() {
    return this.subtotalInclusingTax;
  }

  /**
   * Item entry amount including tax.
   * @returns {number}
   */
  get subtotalInclusingTax() {
    return this.isInclusiveTax ? this.amount : this.amount + this.taxAmount;
  }

  /**
   * Subtotal amount (tax exclusive).
   * @returns {number}
   */
  get subtotalExcludingTax() {
    return this.isInclusiveTax ? this.amount - this.taxAmount : this.amount;
  }

  /**
   * Discount amount.
   * @returns {number}
   */
  get discountAmount() {
    return this.discountType === DiscountType.Percentage
      ? this.amount * (this.discount / 100)
      : this.discount;
  }

  /**
   * Tag rate fraction.
   * @returns {number}
   */
  get tagRateFraction() {
    return this.taxRate / 100;
  }

  /**
   * Tax amount withheld (legacy single tax).
   * @deprecated Use totalTaxAmount for multiple taxes support.
   * @returns {number}
   */
  get taxAmount() {
    // Taxes are calculated on amount AFTER discount
    return this.isInclusiveTax
      ? getInclusiveTaxAmount(this.amountAfterDiscount, this.taxRate)
      : getExlusiveTaxAmount(this.amountAfterDiscount, this.taxRate);
  }

  /**
   * Total tax amount from multiple taxes.
   * Falls back to legacy taxAmount if no taxes relation is loaded.
   * @returns {number}
   */
  get totalTaxAmount(): number {
    // If taxes relation is loaded, sum all tax amounts
    if (this.taxes && this.taxes.length > 0) {
      return this.taxes.reduce((sum, tax) => sum + (tax.taxAmount || 0), 0);
    }
    // Fallback to legacy single tax
    return this.taxAmount;
  }

  /**
   * Remain unallocated landed cost.
   * @return {number}
   */
  get unallocatedCostAmount() {
    return Math.max(this.amount - this.allocatedCostAmount, 0);
  }

  static calcAmount(itemEntry) {
    const { discount, quantity, rate } = itemEntry;
    const total = quantity * rate;

    return discount ? total - total * discount * 0.01 : total;
  }

  /**
   * Item entry relations.
   */
  static get relationMappings() {
    const { Item } = require('../../Items/models/Item');
    const { SaleInvoice } = require('../../SaleInvoices/models/SaleInvoice');
    const {
      BillLandedCostEntry,
    } = require('../../BillLandedCosts/models/BillLandedCostEntry');
    const { Bill } = require('../../Bills/models/Bill');
    const { SaleReceipt } = require('../../SaleReceipts/models/SaleReceipt');
    const { SaleEstimate } = require('../../SaleEstimates/models/SaleEstimate');
    const { TaxRateModel } = require('../../TaxRates/models/TaxRate.model');
    const { ItemEntryTax } = require('../../TaxRates/models/ItemEntryTax.model');
    // const { Expense } = require('../../Expenses/models/Expense.model');
    // const ProjectTask = require('models/Task');

    return {
      item: {
        relation: Model.BelongsToOneRelation,
        modelClass: Item,
        join: {
          from: 'items_entries.itemId',
          to: 'items.id',
        },
      },
      allocatedCostEntries: {
        relation: Model.HasManyRelation,
        modelClass: BillLandedCostEntry,
        join: {
          from: 'items_entries.referenceId',
          to: 'bill_located_cost_entries.entryId',
        },
      },

      invoice: {
        relation: Model.BelongsToOneRelation,
        modelClass: SaleInvoice,
        join: {
          from: 'items_entries.referenceId',
          to: 'sales_invoices.id',
        },
      },

      bill: {
        relation: Model.BelongsToOneRelation,
        modelClass: Bill,
        join: {
          from: 'items_entries.referenceId',
          to: 'bills.id',
        },
      },

      estimate: {
        relation: Model.BelongsToOneRelation,
        modelClass: SaleEstimate,
        join: {
          from: 'items_entries.referenceId',
          to: 'sales_estimates.id',
        },
      },

      /**
       * Sale receipt reference.
       */
      receipt: {
        relation: Model.BelongsToOneRelation,
        modelClass: SaleReceipt,
        join: {
          from: 'items_entries.referenceId',
          to: 'sales_receipts.id',
        },
      },

      /**
       * Project task reference.
       */
      // projectTaskRef: {
      //   relation: Model.HasManyRelation,
      //   modelClass: ProjectTask.default,
      //   join: {
      //     from: 'items_entries.projectRefId',
      //     to: 'tasks.id',
      //   },
      // },

      /**
       * Project expense reference.
       */
      // projectExpenseRef: {
      //   relation: Model.HasManyRelation,
      //   modelClass: Expense.default,
      //   join: {
      //     from: 'items_entries.projectRefId',
      //     to: 'expenses_transactions.id',
      //   },
      // },

      /**
       * Project bill reference.
       */
      // projectBillRef: {
      //   relation: Model.HasManyRelation,
      //   modelClass: Bill,
      //   join: {
      //     from: 'items_entries.projectRefId',
      //     to: 'bills.id',
      //   },
      // },

      /**
       * Tax rate reference (legacy single tax).
       * @deprecated Use taxes relation instead.
       */
      tax: {
        relation: Model.HasOneRelation,
        modelClass: TaxRateModel,
        join: {
          from: 'items_entries.taxRateId',
          to: 'tax_rates.id',
        },
      },

      /**
       * Multiple taxes associated with this entry.
       */
      taxes: {
        relation: Model.HasManyRelation,
        modelClass: ItemEntryTax,
        join: {
          from: 'items_entries.id',
          to: 'items_entries_taxes.itemEntryId',
        },
        modify: (query) => {
          query.orderBy('order', 'ASC');
        },
      },
    };
  }
}
