import { DiscountType } from '@/common/types/Discount';
import { BaseModel } from '@/models/Model';
import { BillLandedCostEntry } from '@/modules/BillLandedCosts/models/BillLandedCostEntry';
import { Item } from '@/modules/Items/models/Item';
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

  public taxRateId: number;

  item: Item;
  allocatedCostEntries: BillLandedCostEntry[];

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
   * Item entry amount.
   * Amount of item entry that may include or exclude tax.
   * @returns {number}
   */
  get amount() {
    return this.quantity * this.rate;
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
   * Tax amount withheld.
   * @returns {number}
   */
  get taxAmount() {
    return this.isInclusiveTax
      ? getInclusiveTaxAmount(this.amount, this.taxRate)
      : getExlusiveTaxAmount(this.amount, this.taxRate);
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
       * Tax rate reference.
       */
      tax: {
        relation: Model.HasOneRelation,
        modelClass: TaxRateModel,
        join: {
          from: 'items_entries.taxRateId',
          to: 'tax_rates.id',
        },
      },
    };
  }
}
