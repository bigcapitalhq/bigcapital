import { Injectable } from '@nestjs/common';
import { AccountNormal } from '@/interfaces/Account';
import { ILedgerEntry } from '@/modules/Ledger/types/Ledger.types';
import { Ledger } from '@/modules/Ledger/Ledger';
import { Vendor } from './models/Vendor';

@Injectable()
export class VendorGLEntries {
  /**
   * Retrieves the opening balance GL common entry.
   * @param {Vendor} vendor -
   */
  private getOpeningBalanceGLCommonEntry = (vendor: Vendor) => {
    return {
      exchangeRate: vendor.openingBalanceExchangeRate,
      currencyCode: vendor.currencyCode,

      transactionType: 'VendorOpeningBalance',
      transactionId: vendor.id,

      date: vendor.openingBalanceAt,
      contactId: vendor.id,

      credit: 0,
      debit: 0,

      branchId: vendor.openingBalanceBranchId,
    };
  };

  /**
   * Retrieves the opening balance GL debit entry.
   * @param   {number} costAccountId -
   * @param   {Vendor} vendor
   * @returns {ILedgerEntry}
   */
  private getOpeningBalanceGLDebitEntry = (
    costAccountId: number,
    vendor: Vendor
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
   * @param   {Vendor} vendor
   * @returns {ILedgerEntry}
   */
  private getOpeningBalanceGLCreditEntry = (
    APAccountId: number,
    vendor: Vendor
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
   * @param   {Vendor} vendor
   * @returns {ILedgerEntry[]}
   */
  public getOpeningBalanceGLEntries = (
    APAccountId: number,
    costAccountId: number,
    vendor: Vendor
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
   * @param   {Vendor} vendor
   * @returns {Ledger}
   */
  public getOpeningBalanceLedger = (
    APAccountId: number,
    costAccountId: number,
    vendor: Vendor
  ) => {
    const entries = this.getOpeningBalanceGLEntries(
      APAccountId,
      costAccountId,
      vendor
    );
    return new Ledger(entries);
  };
}
