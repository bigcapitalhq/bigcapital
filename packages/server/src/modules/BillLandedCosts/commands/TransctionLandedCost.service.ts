import * as R from 'ramda';
import { Model } from 'objection';
import {
  ILandedCostTransaction,
  ILandedCostTransactionEntry,
  LandedCostTransactionModel,
  LandedCostTransactionType,
} from '../types/BillLandedCosts.types';
import { Injectable } from '@nestjs/common';
import { Bill } from '@/modules/Bills/models/Bill';
import { Expense } from '@/modules/Expenses/models/Expense.model';
import { ServiceError } from '@/modules/Items/ServiceError';
import { ContextIdFactory, ModuleRef } from '@nestjs/core';
import { sanitizeModelName } from '@/utils/sanitize-model-name';
import { TenantModelProxy } from '@/modules/System/models/TenantBaseModel';
import { ExpenseLandedCost } from './ExpenseLandedCost.service';
import { BillLandedCost } from './BillLandedCost.service';
import { ERRORS } from '../utils';

@Injectable()
export class TransactionLandedCost {
  constructor(
    private readonly billLandedCost: BillLandedCost,
    private readonly expenseLandedCost: ExpenseLandedCost,
    private readonly moduleRef: ModuleRef,
  ) {}

  /**
   * Retrieve the cost transaction code model.
   * @param {string} transactionType - Transaction type.
   * @returns
   */
  public getModel = async (
    transactionType: string,
  ): Promise<TenantModelProxy<typeof Model>> => {
    const contextId = ContextIdFactory.create();
    const modelName = sanitizeModelName(transactionType);

    const instance = await this.moduleRef.resolve(modelName, contextId, {
      strict: false,
    });
    if (!instance) {
      throw new ServiceError(ERRORS.COST_TYPE_UNDEFINED);
    }
    return instance;
  };

  /**
   * Mappes the given expense or bill transaction to landed cost transaction.
   * @param {string} transactionType - Transaction type.
   * @param {IBill|IExpense} transaction - Expense or bill transaction.
   * @returns {ILandedCostTransaction}
   */
  public transformToLandedCost = 
    (
      transactionType: LandedCostTransactionType,
      transaction: LandedCostTransactionModel,
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
      )(transaction) as ILandedCostTransaction;
    };

  /**
   * Transformes the given expense or bill entry to landed cost transaction entry.
   * @param {string} transactionType
   * @param {} transactionEntry
   * @returns {ILandedCostTransactionEntry}
   */
  public transformToLandedCostEntry = (
    transactionType: LandedCostTransactionType,
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
    )(transactionEntry) as ILandedCostTransactionEntry;
  };
}
