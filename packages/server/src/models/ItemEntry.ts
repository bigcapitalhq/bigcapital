import { Model } from 'objection';
import TenantModel from 'models/TenantModel';
import { getExlusiveTaxAmount, getInclusiveTaxAmount } from '@/utils/taxRate';

export default class ItemEntry extends TenantModel {
  public taxRate: number;
  public discount: number;
  public quantity: number;
  public rate: number;
  public isInclusiveTax: number;

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
      'amount',
      'taxAmount',
      'amountExludingTax',
      'amountInclusingTax',
      'total',
    ];
  }

  /**
   * Item entry total.
   * Amount of item entry includes tax and subtracted discount amount.
   * @returns {number}
   */
  get total() {
    return this.amountInclusingTax;
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
   * Item entry amount including tax.
   * @returns {number}
   */
  get amountInclusingTax() {
    return this.isInclusiveTax ? this.amount : this.amount + this.taxAmount;
  }

  /**
   * Item entry amount excluding tax.
   * @returns {number}
   */
  get amountExludingTax() {
    return this.isInclusiveTax ? this.amount - this.taxAmount : this.amount;
  }

  /**
   * Discount amount.
   * @returns {number}
   */
  get discountAmount() {
    return this.amount * (this.discount / 100);
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
    const Item = require('models/Item');
    const BillLandedCostEntry = require('models/BillLandedCostEntry');
    const SaleInvoice = require('models/SaleInvoice');
    const Bill = require('models/Bill');
    const SaleReceipt = require('models/SaleReceipt');
    const SaleEstimate = require('models/SaleEstimate');
    const ProjectTask = require('models/Task');
    const Expense = require('models/Expense');
    const TaxRate = require('models/TaxRate');

    return {
      item: {
        relation: Model.BelongsToOneRelation,
        modelClass: Item.default,
        join: {
          from: 'items_entries.itemId',
          to: 'items.id',
        },
      },
      allocatedCostEntries: {
        relation: Model.HasManyRelation,
        modelClass: BillLandedCostEntry.default,
        join: {
          from: 'items_entries.referenceId',
          to: 'bill_located_cost_entries.entryId',
        },
      },

      invoice: {
        relation: Model.BelongsToOneRelation,
        modelClass: SaleInvoice.default,
        join: {
          from: 'items_entries.referenceId',
          to: 'sales_invoices.id',
        },
      },

      bill: {
        relation: Model.BelongsToOneRelation,
        modelClass: Bill.default,
        join: {
          from: 'items_entries.referenceId',
          to: 'bills.id',
        },
      },

      estimate: {
        relation: Model.BelongsToOneRelation,
        modelClass: SaleEstimate.default,
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
        modelClass: SaleReceipt.default,
        join: {
          from: 'items_entries.referenceId',
          to: 'sales_receipts.id',
        },
      },

      /**
       * Project task reference.
       */
      projectTaskRef: {
        relation: Model.HasManyRelation,
        modelClass: ProjectTask.default,
        join: {
          from: 'items_entries.projectRefId',
          to: 'tasks.id',
        },
      },

      /**
       * Project expense reference.
       */
      projectExpenseRef: {
        relation: Model.HasManyRelation,
        modelClass: Expense.default,
        join: {
          from: 'items_entries.projectRefId',
          to: 'expenses_transactions.id',
        },
      },

      /**
       * Project bill reference.
       */
      projectBillRef: {
        relation: Model.HasManyRelation,
        modelClass: Bill.default,
        join: {
          from: 'items_entries.projectRefId',
          to: 'bills.id',
        },
      },

      /**
       * Tax rate reference.
       */
      tax: {
        relation: Model.HasOneRelation,
        modelClass: TaxRate.default,
        join: {
          from: 'items_entries.taxRateId',
          to: 'tax_rates.id',
        },
      },
    };
  }
}
