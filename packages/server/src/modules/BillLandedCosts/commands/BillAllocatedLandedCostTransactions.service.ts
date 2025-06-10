import { Inject, Injectable } from '@nestjs/common';
import { I18nService } from 'nestjs-i18n';
import { omit } from 'lodash';
import * as R from 'ramda';
import { TenantModelProxy } from '@/modules/System/models/TenantBaseModel';
import { Bill } from '@/modules/Bills/models/Bill';
import { BillLandedCost } from '../models/BillLandedCost';
import { IBillLandedCostTransaction } from '../types/BillLandedCosts.types';

@Injectable()
export class BillAllocatedLandedCostTransactions {
  constructor(
    private readonly i18nService: I18nService,

    @Inject(Bill.name)
    private readonly billModel: TenantModelProxy<typeof Bill>,

    @Inject(BillLandedCost.name)
    private readonly billLandedCostModel: TenantModelProxy<
      typeof BillLandedCost
    >,
  ) {}

  /**
   * Retrieve the bill associated landed cost transactions.
   * @param  {number} tenantId - Tenant id.
   * @param  {number} billId - Bill id.
   * @return {Promise<IBillLandedCostTransaction>}
   */
  public getBillLandedCostTransactions = async (
    billId: number,
  ): Promise<IBillLandedCostTransaction> => {
    // Retrieve the given bill id or throw not found service error.
    const bill = await this.billModel()
      .query()
      .findById(billId)
      .throwIfNotFound();

    // Retrieve the bill associated allocated landed cost with bill and expense entry.
    const landedCostTransactions = await this.billLandedCostModel()
      .query()
      .where('bill_id', billId)
      .withGraphFetched('allocateEntries')
      .withGraphFetched('allocatedFromBillEntry.item')
      .withGraphFetched('allocatedFromExpenseEntry.expenseAccount')
      .withGraphFetched('bill');

    const transactionsJson = this.i18nService.i18nApply(
      [[qim.$each, 'allocationMethodFormatted']],
      landedCostTransactions.map((a) => a.toJSON()),
      tenantId,
    );
    return this.transformBillLandedCostTransactions(transactionsJson);
  };

  /**
   *
   * @param {IBillLandedCostTransaction[]} landedCostTransactions
   * @returns
   */
  private transformBillLandedCostTransactions = (
    landedCostTransactions: IBillLandedCostTransaction[],
  ) => {
    return landedCostTransactions.map(this.transformBillLandedCostTransaction);
  };

  /**
   *
   * @param {IBillLandedCostTransaction} transaction
   * @returns
   */
  private transformBillLandedCostTransaction = (
    transaction: IBillLandedCostTransaction,
  ) => {
    const getTransactionName = R.curry(this.condBillLandedTransactionName)(
      transaction.fromTransactionType,
    );
    const getTransactionDesc = R.curry(
      this.condBillLandedTransactionDescription,
    )(transaction.fromTransactionType);

    return {
      formattedAmount: formatNumber(transaction.amount, {
        currencyCode: transaction.currencyCode,
      }),
      ...omit(transaction, [
        'allocatedFromBillEntry',
        'allocatedFromExpenseEntry',
      ]),
      name: getTransactionName(transaction),
      description: getTransactionDesc(transaction),
      formattedLocalAmount: formatNumber(transaction.localAmount, {
        currencyCode: 'USD',
      }),
    };
  };

  /**
   * Retrieve bill landed cost tranaction name based on the given transaction type.
   * @param transactionType
   * @param transaction
   * @returns
   */
  private condBillLandedTransactionName = (
    transactionType: string,
    transaction,
  ) => {
    return R.cond([
      [
        R.always(R.equals(transactionType, 'Bill')),
        this.getLandedBillTransactionName,
      ],
      [
        R.always(R.equals(transactionType, 'Expense')),
        this.getLandedExpenseTransactionName,
      ],
    ])(transaction);
  };

  /**
   *
   * @param transaction
   * @returns
   */
  private getLandedBillTransactionName = (transaction): string => {
    return transaction.allocatedFromBillEntry.item.name;
  };

  /**
   *
   * @param transaction
   * @returns
   */
  private getLandedExpenseTransactionName = (transaction): string => {
    return transaction.allocatedFromExpenseEntry.expenseAccount.name;
  };

  /**
   * Retrieve landed cost.
   * @param transaction
   * @returns
   */
  private getLandedBillTransactionDescription = (transaction): string => {
    return transaction.allocatedFromBillEntry.description;
  };

  /**
   *
   * @param transaction
   * @returns
   */
  private getLandedExpenseTransactionDescription = (transaction): string => {
    return transaction.allocatedFromExpenseEntry.description;
  };

  /**
   * Retrieve the bill landed cost transaction description based on transaction type.
   * @param {string} tranasctionType
   * @param transaction
   * @returns
   */
  private condBillLandedTransactionDescription = (
    tranasctionType: string,
    transaction,
  ) => {
    return R.cond([
      [
        R.always(R.equals(tranasctionType, 'Bill')),
        this.getLandedBillTransactionDescription,
      ],
      [
        R.always(R.equals(tranasctionType, 'Expense')),
        this.getLandedExpenseTransactionDescription,
      ],
    ])(transaction);
  };
}
