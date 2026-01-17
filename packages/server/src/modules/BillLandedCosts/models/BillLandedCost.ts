import { Model } from 'objection';
import { lowerCase } from 'lodash';
// import TenantModel from 'models/TenantModel';
import { BaseModel } from '@/models/Model';
import { Bill } from '@/modules/Bills/models/Bill';
import { BillLandedCostEntry } from './BillLandedCostEntry';
import { ItemEntry } from '@/modules/TransactionItemEntry/models/ItemEntry';
import { ExpenseCategory } from '@/modules/Expenses/models/ExpenseCategory.model';

export class BillLandedCost extends BaseModel {
  amount!: number;
  fromTransactionId!: number;
  fromTransactionType!: string;
  fromTransactionEntryId!: number;
  allocationMethod!: string;
  costAccountId!: number;
  description!: string;
  billId!: number;
  exchangeRate!: number;
  currencyCode!: string;

  bill!: Bill;
  allocateEntries!: BillLandedCostEntry[];
  allocatedFromBillEntry!: ItemEntry;
  allocatedFromExpenseEntry!: ExpenseCategory;

  /**
   * Table name
   */
  static get tableName() {
    return 'bill_located_costs';
  }

  /**
   * Model timestamps.
   */
  get timestamps() {
    return ['createdAt', 'updatedAt'];
  }

  /**
   * Virtual attributes.
   */
  static get virtualAttributes() {
    return ['localAmount', 'allocationMethodFormatted'];
  }

  /**
   * Retrieves the cost local amount.
   * @returns {number}
   */
  get localAmount() {
    return this.amount * this.exchangeRate;
  }

  /**
   * Allocation method formatted.
   */
  get allocationMethodFormatted() {
    const allocationMethod = lowerCase(this.allocationMethod);

    const keyLabelsPairs = {
      value: 'bill.allocation_method.value',
      quantity: 'bill.allocation_method.quantity',
    };
    return keyLabelsPairs[allocationMethod] || '';
  }

  /**
   * Relationship mapping.
   */
  static get relationMappings() {
    const { BillLandedCostEntry } = require('./BillLandedCostEntry');
    const { Bill } = require('../../Bills/models/Bill');
    const {
      ItemEntry,
    } = require('../../TransactionItemEntry/models/ItemEntry');
    const {
      ExpenseCategory,
    } = require('../../Expenses/models/ExpenseCategory.model');

    return {
      bill: {
        relation: Model.BelongsToOneRelation,
        modelClass: Bill,
        join: {
          from: 'bill_located_costs.billId',
          to: 'bills.id',
        },
      },
      allocateEntries: {
        relation: Model.HasManyRelation,
        modelClass: BillLandedCostEntry,
        join: {
          from: 'bill_located_costs.id',
          to: 'bill_located_cost_entries.billLocatedCostId',
        },
      },
      allocatedFromBillEntry: {
        relation: Model.BelongsToOneRelation,
        modelClass: ItemEntry,
        join: {
          from: 'bill_located_costs.fromTransactionEntryId',
          to: 'items_entries.id',
        },
      },
      allocatedFromExpenseEntry: {
        relation: Model.BelongsToOneRelation,
        modelClass: ExpenseCategory,
        join: {
          from: 'bill_located_costs.fromTransactionEntryId',
          to: 'expense_transaction_categories.id',
        },
      },
    };
  }
}
