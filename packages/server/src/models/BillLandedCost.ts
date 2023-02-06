import { Model } from 'objection';
import { lowerCase } from 'lodash';
import TenantModel from 'models/TenantModel';

export default class BillLandedCost extends TenantModel {
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
      value: 'allocation_method.value.label',
      quantity: 'allocation_method.quantity.label',
    };
    return keyLabelsPairs[allocationMethod] || '';
  }

  /**
   * Relationship mapping.
   */
  static get relationMappings() {
    const BillLandedCostEntry = require('models/BillLandedCostEntry');
    const Bill = require('models/Bill');
    const ItemEntry = require('models/ItemEntry');
    const ExpenseCategory = require('models/ExpenseCategory');

    return {
      bill: {
        relation: Model.BelongsToOneRelation,
        modelClass: Bill.default,
        join: {
          from: 'bill_located_costs.billId',
          to: 'bills.id',
        },
      },
      allocateEntries: {
        relation: Model.HasManyRelation,
        modelClass: BillLandedCostEntry.default,
        join: {
          from: 'bill_located_costs.id',
          to: 'bill_located_cost_entries.billLocatedCostId',
        },
      },
      allocatedFromBillEntry: {
        relation: Model.BelongsToOneRelation,
        modelClass: ItemEntry.default,
        join: {
          from: 'bill_located_costs.fromTransactionEntryId',
          to: 'items_entries.id',
        },
      },
      allocatedFromExpenseEntry: {
        relation: Model.BelongsToOneRelation,
        modelClass: ExpenseCategory.default,
        join: {
          from: 'bill_located_costs.fromTransactionEntryId',
          to: 'expense_transaction_categories.id',
        },
      },
    };
  }
}
