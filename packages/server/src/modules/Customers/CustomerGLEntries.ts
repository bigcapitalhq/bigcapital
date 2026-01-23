import { Injectable } from '@nestjs/common';
import { AccountNormal } from '@/interfaces/Account';
import { ILedgerEntry } from '@/modules/Ledger/types/Ledger.types';
import { Ledger } from '@/modules/Ledger/Ledger';
import { Customer } from './models/Customer';

@Injectable()
export class CustomerGLEntries {
  /**
   * Retrieves the customer opening balance common entry attributes.
   */
  private getCustomerOpeningGLCommonEntry = (customer: Customer) => {
    return {
      exchangeRate: customer.openingBalanceExchangeRate,
      currencyCode: customer.currencyCode,

      transactionType: 'CustomerOpeningBalance',
      transactionId: customer.id,

      date: customer.openingBalanceAt,
      contactId: customer.id,

      credit: 0,
      debit: 0,

      branchId: customer.openingBalanceBranchId,
    };
  };

  /**
   * Retrieves the customer opening GL credit entry.
   */
  private getCustomerOpeningGLCreditEntry = (
    ARAccountId: number,
    customer: Customer
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
   */
  private getCustomerOpeningGLDebitEntry = (
    incomeAccountId: number,
    customer: Customer
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
   */
  public getCustomerOpeningGLEntries = (
    ARAccountId: number,
    incomeAccountId: number,
    customer: Customer
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
   */
  public getCustomerOpeningLedger = (
    ARAccountId: number,
    incomeAccountId: number,
    customer: Customer
  ) => {
    const entries = this.getCustomerOpeningGLEntries(
      ARAccountId,
      incomeAccountId,
      customer
    );
    return new Ledger(entries);
  };
}
