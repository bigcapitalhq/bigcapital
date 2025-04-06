import { ILedgerEntry } from '@/modules/Ledger/types/Ledger.types';
import { BankTransaction } from '../models/BankTransaction';
import { transformCashflowTransactionType } from '../utils';
import { Ledger } from '@/modules/Ledger/Ledger';

export class BankTransactionGL {
  private bankTransactionModel: BankTransaction;
  /**
   * @param {BankTransaction} bankTransactionModel - The bank transaction model.
   */
  constructor(bankTransactionModel: BankTransaction) {
    this.bankTransactionModel = bankTransactionModel;
  }

  /**
   * Retrieves the common entry of cashflow transaction.
   * @returns {Partial<ILedgerEntry>}
   */
  private get commonEntry() {
    const { entries, ...transaction } = this.bankTransactionModel;

    return {
      date: this.bankTransactionModel.date,
      currencyCode: this.bankTransactionModel.currencyCode,
      exchangeRate: this.bankTransactionModel.exchangeRate,

      transactionType: 'CashflowTransaction',
      transactionId: this.bankTransactionModel.id,
      transactionNumber: this.bankTransactionModel.transactionNumber,
      transactionSubType: transformCashflowTransactionType(
        this.bankTransactionModel.transactionType,
      ),
      referenceNumber: this.bankTransactionModel.referenceNo,

      note: this.bankTransactionModel.description,

      branchId: this.bankTransactionModel.branchId,
      userId: this.bankTransactionModel.userId,
    };
  }

  /**
   * Retrieves the cashflow debit GL entry.
   * @returns {ILedgerEntry}
   */
  private get cashflowDebitGLEntry(): ILedgerEntry {
    const commonEntry = this.commonEntry;

    return {
      ...commonEntry,
      accountId: this.bankTransactionModel.cashflowAccountId,
      credit: this.bankTransactionModel.isCashCredit
        ? this.bankTransactionModel.localAmount
        : 0,
      debit: this.bankTransactionModel.isCashDebit
        ? this.bankTransactionModel.localAmount
        : 0,
      accountNormal: this.bankTransactionModel?.cashflowAccount?.accountNormal,
      index: 1,
    };
  }

  /**
   * Retrieves the cashflow credit GL entry.
   * @returns {ILedgerEntry}
   */
  private get cashflowCreditGLEntry(): ILedgerEntry {
    return {
      ...this.commonEntry,
      credit: this.bankTransactionModel.isCashDebit
        ? this.bankTransactionModel.localAmount
        : 0,
      debit: this.bankTransactionModel.isCashCredit
        ? this.bankTransactionModel.localAmount
        : 0,
      accountId: this.bankTransactionModel.creditAccountId,
      accountNormal: this.bankTransactionModel.creditAccount.accountNormal,
      index: 2,
    };
  }

  /**
   * Retrieves the cashflow transaction GL entry.
   * @returns {ILedgerEntry[]}
   */
  private getJournalEntries(): ILedgerEntry[] {
    const debitEntry = this.cashflowDebitGLEntry;
    const creditEntry = this.cashflowCreditGLEntry;

    return [debitEntry, creditEntry];
  }

  /**
   * Retrieves the cashflow GL ledger.
   * @returns {Ledger}
   */
  public getCashflowLedger() {
    const entries = this.getJournalEntries();

    return new Ledger(entries);
  }
}
