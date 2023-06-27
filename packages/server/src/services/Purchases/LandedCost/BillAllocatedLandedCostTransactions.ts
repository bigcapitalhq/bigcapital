import { Inject, Service } from 'typedi';
import { omit } from 'lodash';
import * as R from 'ramda';
import * as qim from 'qim';
import { IBillLandedCostTransaction } from '@/interfaces';
import HasTenancyService from '@/services/Tenancy/TenancyService';
import { formatNumber } from 'utils';
import I18nService from '@/services/I18n/I18nService';

@Service()
export default class BillAllocatedLandedCostTransactions {
  @Inject()
  private tenancy: HasTenancyService;

  @Inject()
  private i18nService: I18nService;

  /**
   * Retrieve the bill associated landed cost transactions.
   * @param  {number} tenantId - Tenant id.
   * @param  {number} billId - Bill id.
   * @return {Promise<IBillLandedCostTransaction>}
   */
  public getBillLandedCostTransactions = async (
    tenantId: number,
    billId: number
  ): Promise<IBillLandedCostTransaction> => {
    const { BillLandedCost, Bill } = this.tenancy.models(tenantId);

    // Retrieve the given bill id or throw not found service error.
    const bill = await Bill.query().findById(billId).throwIfNotFound();

    // Retrieve the bill associated allocated landed cost with bill and expense entry.
    const landedCostTransactions = await BillLandedCost.query()
      .where('bill_id', billId)
      .withGraphFetched('allocateEntries')
      .withGraphFetched('allocatedFromBillEntry.item')
      .withGraphFetched('allocatedFromExpenseEntry.expenseAccount')
      .withGraphFetched('bill');

    const transactionsJson = this.i18nService.i18nApply(
      [[qim.$each, 'allocationMethodFormatted']],
      landedCostTransactions.map((a) => a.toJSON()),
      tenantId
    );
    return this.transformBillLandedCostTransactions(transactionsJson);
  };

  /**
   *
   * @param {IBillLandedCostTransaction[]} landedCostTransactions
   * @returns
   */
  private transformBillLandedCostTransactions = (
    landedCostTransactions: IBillLandedCostTransaction[]
  ) => {
    return landedCostTransactions.map(this.transformBillLandedCostTransaction);
  };

  /**
   *
   * @param {IBillLandedCostTransaction} transaction
   * @returns
   */
  private transformBillLandedCostTransaction = (
    transaction: IBillLandedCostTransaction
  ) => {
    const getTransactionName = R.curry(this.condBillLandedTransactionName)(
      transaction.fromTransactionType
    );
    const getTransactionDesc = R.curry(
      this.condBillLandedTransactionDescription
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
   * Retrieve bill landed cost transaction name based on the given transaction type.
   * @param transactionType
   * @param transaction
   * @returns
   */
  private condBillLandedTransactionName = (
    transactionType: string,
    transaction
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
   * @param {string} transactionType
   * @param transaction
   * @returns
   */
  private condBillLandedTransactionDescription = (
    transactionType: string,
    transaction
  ) => {
    return R.cond([
      [
        R.always(R.equals(transactionType, 'Bill')),
        this.getLandedBillTransactionDescription,
      ],
      [
        R.always(R.equals(transactionType, 'Expense')),
        this.getLandedExpenseTransactionDescription,
      ],
    ])(transaction);
  };
}
