import { Injectable } from '@nestjs/common';
import { ref } from 'objection';
import { curry, pipe, map } from 'lodash/fp';
import * as R from 'ramda';
import {
  ILandedCostTransaction,
  ILandedCostTransactionDOJO,
  ILandedCostTransactionEntry,
  ILandedCostTransactionEntryDOJO,
} from '../types/BillLandedCosts.types';
import { TransactionLandedCost } from './TransctionLandedCost.service';
import { formatNumber } from '@/utils/format-number';
import { LandedCostTransactionsQueryDto } from '../dtos/LandedCostTransactionsQuery.dto';

@Injectable()
export class LandedCostTranasctions {
  constructor(private readonly transactionLandedCost: TransactionLandedCost) { }

  /**
   * Retrieve the landed costs based on the given query.
   * @param {LandedCostTransactionsQueryDto} query -
   * @returns {Promise<ILandedCostTransaction[]>}
   */
  public getLandedCostTransactions = async (
    query: LandedCostTransactionsQueryDto,
  ): Promise<ILandedCostTransaction[]> => {
    const { transactionType } = query;
    const Model = await this.transactionLandedCost.getModel(
      query.transactionType,
    );
    // Retrieve the model entities.
    const transactions = await Model()
      .query()
      .onBuild((q) => {
        q.where('allocated_cost_amount', '<', ref('landed_cost_amount'));

        if (query.transactionType === 'Bill') {
          q.withGraphFetched('entries.item');
        } else if (query.transactionType === 'Expense') {
          q.withGraphFetched('categories.expenseAccount');
        }
      });
    const transformLandedCost = curry(
      this.transactionLandedCost.transformToLandedCost,
    )(transactionType);

    return pipe(
      R.map(transformLandedCost),
      this.transformLandedCostTransactions,
    )(transactions);
  };

  /**
   * Transformes the landed cost transactions.
   * @param {ILandedCostTransaction[]} transactions
   * @returns {ILandedCostTransactionDOJO[]}
   */
  public transformLandedCostTransactions = (
    transactions: ILandedCostTransaction[],
  ) => {
    return R.map(this.transformLandedCostTransaction)(transactions);
  };

  /**
   * Transformes the landed cost transaction.
   * @param {ILandedCostTransaction} transaction - Landed cost transaction.
   * @returns {ILandedCostTransactionDOJO}
   */
  public transformLandedCostTransaction = (
    transaction: ILandedCostTransaction,
  ): ILandedCostTransactionDOJO => {
    const { currencyCode } = transaction;

    // Formatted transaction amount.
    const formattedAmount = formatNumber(transaction.amount, { currencyCode });

    // Formatted transaction unallocated cost amount.
    const formattedUnallocatedCostAmount = formatNumber(
      transaction.unallocatedCostAmount,
      { currencyCode },
    );
    // Formatted transaction allocated cost amount.
    const formattedAllocatedCostAmount = formatNumber(
      transaction.allocatedCostAmount,
      { currencyCode },
    );
    const transformLandedCostEntry = R.curry(this.transformLandedCostEntry)(
      transaction,
    );
    const entries = R.map<
      ILandedCostTransactionEntry,
      ILandedCostTransactionEntryDOJO
    >(transformLandedCostEntry)(transaction.entries ?? []);

    return {
      ...transaction,
      formattedAmount,
      formattedUnallocatedCostAmount,
      formattedAllocatedCostAmount,
      entries,
    };
  };

  /**
   * Transformes the landed cost transaction entry.
   * @param {ILandedCostTransaction} transaction - Landed cost transaction.
   * @param {ILandedCostTransactionEntry} entry - Landed cost transaction entry.
   * @returns {ILandedCostTransactionEntryDOJO}
   */
  public transformLandedCostEntry = (
    transaction: ILandedCostTransaction,
    entry: ILandedCostTransactionEntry,
  ): ILandedCostTransactionEntryDOJO => {
    const { currencyCode } = transaction;

    // Formatted entry amount.
    const formattedAmount = formatNumber(entry.amount, { currencyCode });

    // Formatted entry unallocated cost amount.
    const formattedUnallocatedCostAmount = formatNumber(
      entry.unallocatedCostAmount,
      { currencyCode },
    );
    // Formatted entry allocated cost amount.
    const formattedAllocatedCostAmount = formatNumber(
      entry.allocatedCostAmount,
      { currencyCode },
    );
    return {
      ...entry,
      formattedAmount,
      formattedUnallocatedCostAmount,
      formattedAllocatedCostAmount,
    };
  };
}
