import { Service, Inject } from 'typedi';
import { AccountNormal, ICustomer, ILedgerEntry } from '@/interfaces';
import Ledger from '@/services/Accounting/Ledger';

@Service()
export class CustomerGLEntries {
  /**
   * Retrieves the customer opening balance common entry attributes.
   * @param {ICustomer} customer
   */
  private getCustomerOpeningGLCommonEntry = (customer: ICustomer) => {
    return {
      exchangeRate: customer.openingBalanceExchangeRate,
      currencyCode: customer.currencyCode,

      transactionType: 'CustomerOpeningBalance',
      transactionId: customer.id,

      date: customer.openingBalanceAt,
      userId: customer.userId,
      contactId: customer.id,

      credit: 0,
      debit: 0,

      branchId: customer.openingBalanceBranchId,
    };
  };

  /**
   * Retrieves the customer opening GL credit entry.
   * @param   {number} ARAccountId
   * @param   {ICustomer} customer
   * @returns {ILedgerEntry}
   */
  private getCustomerOpeningGLCreditEntry = (
    ARAccountId: number,
    customer: ICustomer
  ): ILedgerEntry => {
    const commonEntry = this.getCustomerOpeningGLCommonEntry(customer);

    return {
      ...commonEntry,
      credit: 0,
      debit: customer.localOpeningBalance,
      accountId: ARAccountId,
      accountNormal: AccountNormal.DEBIT,
      index: 1,
    };
  };

  /**
   * Retrieves the customer opening GL debit entry.
   * @param   {number} incomeAccountId
   * @param   {ICustomer} customer
   * @returns {ILedgerEntry}
   */
  private getCustomerOpeningGLDebitEntry = (
    incomeAccountId: number,
    customer: ICustomer
  ): ILedgerEntry => {
    const commonEntry = this.getCustomerOpeningGLCommonEntry(customer);

    return {
      ...commonEntry,
      credit: customer.localOpeningBalance,
      debit: 0,
      accountId: incomeAccountId,
      accountNormal: AccountNormal.CREDIT,

      index: 2,
    };
  };

  /**
   * Retrieves the customer opening GL entries.
   * @param   {number} ARAccountId
   * @param   {number} incomeAccountId
   * @param   {ICustomer} customer
   * @returns {ILedgerEntry[]}
   */
  public getCustomerOpeningGLEntries = (
    ARAccountId: number,
    incomeAccountId: number,
    customer: ICustomer
  ) => {
    const debitEntry = this.getCustomerOpeningGLDebitEntry(
      incomeAccountId,
      customer
    );
    const creditEntry = this.getCustomerOpeningGLCreditEntry(
      ARAccountId,
      customer
    );
    return [debitEntry, creditEntry];
  };

  /**
   * Retrieves the customer opening balance ledger.
   * @param   {number} ARAccountId
   * @param   {number} incomeAccountId
   * @param   {ICustomer} customer
   * @returns {ILedger}
   */
  public getCustomerOpeningLedger = (
    ARAccountId: number,
    incomeAccountId: number,
    customer: ICustomer
  ) => {
    const entries = this.getCustomerOpeningGLEntries(
      ARAccountId,
      incomeAccountId,
      customer
    );
    return new Ledger(entries);
  };
}
