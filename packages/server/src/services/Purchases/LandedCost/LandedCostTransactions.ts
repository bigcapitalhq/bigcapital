import { Inject, Service } from 'typedi';
import { ref } from 'objection';
import * as R from 'ramda';
import {
  ILandedCostTransactionsQueryDTO,
  ILandedCostTransaction,
  ILandedCostTransactionDOJO,
  ILandedCostTransactionEntry,
  ILandedCostTransactionEntryDOJO,
} from '@/interfaces';
import TransactionLandedCost from './TransactionLandedCost';
import BillsService from '../Bills';
import HasTenancyService from '@/services/Tenancy/TenancyService';
import { formatNumber } from 'utils';

@Service()
export default class LandedCostTransactions {
  @Inject()
  transactionLandedCost: TransactionLandedCost;

  @Inject()
  billsService: BillsService;

  @Inject()
  tenancy: HasTenancyService;

  /**
   * Retrieve the landed costs based on the given query.
   * @param {number} tenantId
   * @param {ILandedCostTransactionsQueryDTO} query
   * @returns {Promise<ILandedCostTransaction[]>}
   */
  public getLandedCostTransactions = async (
    tenantId: number,
    query: ILandedCostTransactionsQueryDTO
  ): Promise<ILandedCostTransaction[]> => {
    const { transactionType } = query;
    const Model = this.transactionLandedCost.getModel(
      tenantId,
      query.transactionType
    );
    // Retrieve the model entities.
    const transactions = await Model.query().onBuild((q) => {
      q.where('allocated_cost_amount', '<', ref('landed_cost_amount'));

      if (query.transactionType === 'Bill') {
        q.withGraphFetched('entries.item');
      } else if (query.transactionType === 'Expense') {
        q.withGraphFetched('categories.expenseAccount');
      }
    });
    const transformLandedCost =
      this.transactionLandedCost.transformToLandedCost(transactionType);

    return R.compose(
      this.transformLandedCostTransactions,
      R.map(transformLandedCost)
    )(transactions);
  };

  /**
   *
   * @param transactions
   * @returns
   */
  public transformLandedCostTransactions = (
    transactions: ILandedCostTransaction[]
  ) => {
    return R.map(this.transformLandedCostTransaction)(transactions);
  };

  /**
   * Transformes the landed cost transaction.
   * @param {ILandedCostTransaction} transaction
   */
  public transformLandedCostTransaction = (
    transaction: ILandedCostTransaction
  ): ILandedCostTransactionDOJO => {
    const { currencyCode } = transaction;

    // Formatted transaction amount.
    const formattedAmount = formatNumber(transaction.amount, { currencyCode });

    // Formatted transaction unallocated cost amount.
    const formattedUnallocatedCostAmount = formatNumber(
      transaction.unallocatedCostAmount,
      { currencyCode }
    );
    // Formatted transaction allocated cost amount.
    const formattedAllocatedCostAmount = formatNumber(
      transaction.allocatedCostAmount,
      { currencyCode }
    );

    return {
      ...transaction,
      formattedAmount,
      formattedUnallocatedCostAmount,
      formattedAllocatedCostAmount,
      entries: R.map(this.transformLandedCostEntry(transaction))(
        transaction.entries
      ),
    };
  };

  /**
   *
   * @param {ILandedCostTransaction} transaction
   * @param {ILandedCostTransactionEntry} entry
   * @returns {ILandedCostTransactionEntryDOJO}
   */
  public transformLandedCostEntry = R.curry(
    (
      transaction: ILandedCostTransaction,
      entry: ILandedCostTransactionEntry
    ): ILandedCostTransactionEntryDOJO => {
      const { currencyCode } = transaction;

      // Formatted entry amount.
      const formattedAmount = formatNumber(entry.amount, { currencyCode });

      // Formatted entry unallocated cost amount.
      const formattedUnallocatedCostAmount = formatNumber(
        entry.unallocatedCostAmount,
        { currencyCode }
      );
      // Formatted entry allocated cost amount.
      const formattedAllocatedCostAmount = formatNumber(
        entry.allocatedCostAmount,
        { currencyCode }
      );
      return {
        ...entry,
        formattedAmount,
        formattedUnallocatedCostAmount,
        formattedAllocatedCostAmount,
      };
    }
  );
}
