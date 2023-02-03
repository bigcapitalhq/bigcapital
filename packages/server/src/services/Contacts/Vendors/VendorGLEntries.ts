import { Service } from 'typedi';
import { IVendor, AccountNormal, ILedgerEntry } from '@/interfaces';
import Ledger from '@/services/Accounting/Ledger';

@Service()
export class VendorGLEntries {
  /**
   * Retrieves the opening balance GL common entry.
   * @param {IVendor} vendor -
   */
  private getOpeningBalanceGLCommonEntry = (vendor: IVendor) => {
    return {
      exchangeRate: vendor.openingBalanceExchangeRate,
      currencyCode: vendor.currencyCode,

      transactionType: 'VendorOpeningBalance',
      transactionId: vendor.id,

      date: vendor.openingBalanceAt,
      userId: vendor.userId,
      contactId: vendor.id,

      credit: 0,
      debit: 0,

      branchId: vendor.openingBalanceBranchId,
    };
  };

  /**
   * Retrieves the opening balance GL debit entry.
   * @param   {number} costAccountId -
   * @param   {IVendor} vendor
   * @returns {ILedgerEntry}
   */
  private getOpeningBalanceGLDebitEntry = (
    costAccountId: number,
    vendor: IVendor
  ): ILedgerEntry => {
    const commonEntry = this.getOpeningBalanceGLCommonEntry(vendor);

    return {
      ...commonEntry,
      accountId: costAccountId,
      accountNormal: AccountNormal.DEBIT,
      debit: vendor.localOpeningBalance,
      credit: 0,
      index: 2,
    };
  };

  /**
   * Retrieves the opening balance GL credit entry.
   * @param   {number} APAccountId
   * @param   {IVendor} vendor
   * @returns {ILedgerEntry}
   */
  private getOpeningBalanceGLCreditEntry = (
    APAccountId: number,
    vendor: IVendor
  ): ILedgerEntry => {
    const commonEntry = this.getOpeningBalanceGLCommonEntry(vendor);

    return {
      ...commonEntry,
      accountId: APAccountId,
      accountNormal: AccountNormal.CREDIT,
      credit: vendor.localOpeningBalance,
      index: 1,
    };
  };

  /**
   * Retrieves the opening balance GL entries.
   * @param   {number} APAccountId
   * @param   {number} costAccountId -
   * @param   {IVendor} vendor
   * @returns {ILedgerEntry[]}
   */
  public getOpeningBalanceGLEntries = (
    APAccountId: number,
    costAccountId: number,
    vendor: IVendor
  ): ILedgerEntry[] => {
    const debitEntry = this.getOpeningBalanceGLDebitEntry(
      costAccountId,
      vendor
    );
    const creditEntry = this.getOpeningBalanceGLCreditEntry(
      APAccountId,
      vendor
    );
    return [debitEntry, creditEntry];
  };

  /**
   * Retrieves the opening balance ledger.
   * @param   {number} APAccountId
   * @param   {number} costAccountId -
   * @param   {IVendor} vendor
   * @returns {Ledger}
   */
  public getOpeningBalanceLedger = (
    APAccountId: number,
    costAccountId: number,
    vendor: IVendor
  ) => {
    const entries = this.getOpeningBalanceGLEntries(
      APAccountId,
      costAccountId,
      vendor
    );
    return new Ledger(entries);
  };
}
