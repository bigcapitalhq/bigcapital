import * as R from 'ramda';
import { Model } from 'objection';
import {
  ILandedCostTransaction,
  ILandedCostTransactionEntry,
} from '../types/BillLandedCosts.types';
import { Injectable } from '@nestjs/common';
import { BillLandedCost } from '../models/BillLandedCost';
import { Bill } from '@/modules/Bills/models/Bill';
import { Expense } from '@/modules/Expenses/models/Expense.model';
import { ServiceError } from '@/modules/Items/ServiceError';
import { ERRORS } from '../utils';
import { ExpenseLandedCost } from '../models/ExpenseLandedCost';

@Injectable()
export class TransactionLandedCost {
  constructor(
    private readonly billLandedCost: BillLandedCost,
    private readonly expenseLandedCost: ExpenseLandedCost,
  ) {}
  /**
   * Retrieve the cost transaction code model.
   * @param {number} tenantId - Tenant id.
   * @param {string} transactionType - Transaction type.
   * @returns
   */
  public getModel = (tenantId: number, transactionType: string): Model => {
    const Models = this.tenancy.models(tenantId);
    const Model = Models[transactionType];

    if (!Model) {
      throw new ServiceError(ERRORS.COST_TYPE_UNDEFINED);
    }
    return Model;
  };

  /**
   * Mappes the given expense or bill transaction to landed cost transaction.
   * @param {string} transactionType - Transaction type.
   * @param {IBill|IExpense} transaction - Expense or bill transaction.
   * @returns {ILandedCostTransaction}
   */
  public transformToLandedCost = R.curry(
    (
      transactionType: string,
      transaction: Bill | Expense,
    ): ILandedCostTransaction => {
      return R.compose(
        R.when(
          R.always(transactionType === 'Bill'),
          this.billLandedCost.transformToLandedCost,
        ),
        R.when(
          R.always(transactionType === 'Expense'),
          this.expenseLandedCost.transformToLandedCost,
        ),
      )(transaction);
    },
  );

  /**
   * Transformes the given expense or bill entry to landed cost transaction entry.
   * @param {string} transactionType
   * @param {} transactionEntry
   * @returns {ILandedCostTransactionEntry}
   */
  public transformToLandedCostEntry = (
    transactionType: 'Bill' | 'Expense',
    transactionEntry,
  ): ILandedCostTransactionEntry => {
    return R.compose(
      R.when(
        R.always(transactionType === 'Bill'),
        this.billLandedCost.transformToLandedCostEntry,
      ),
      R.when(
        R.always(transactionType === 'Expense'),
        this.expenseLandedCost.transformToLandedCostEntry,
      ),
    )(transactionEntry);
  };
}
