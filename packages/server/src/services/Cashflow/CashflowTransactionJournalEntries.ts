import { Inject, Service } from 'typedi';
import { Knex } from 'knex';
import { ILedgerEntry, ICashflowTransaction } from '../../interfaces';
import { transformCashflowTransactionType } from './utils';
import LedgerStorageService from '@/services/Accounting/LedgerStorageService';
import Ledger from '@/services/Accounting/Ledger';
import HasTenancyService from '@/services/Tenancy/TenancyService';

@Service()
export default class CashflowTransactionJournalEntries {
  @Inject()
  private ledgerStorage: LedgerStorageService;

  @Inject()
  private tenancy: HasTenancyService;

  /**
   * Retrieves the common entry of cashflow transaction.
   * @param {ICashflowTransaction} cashflowTransaction
   * @returns {Partial<ILedgerEntry>}
   */
  private getCommonEntry = (cashflowTransaction: ICashflowTransaction) => {
    const { entries, ...transaction } = cashflowTransaction;

    return {
      date: transaction.date,
      currencyCode: transaction.currencyCode,
      exchangeRate: transaction.exchangeRate,

      transactionType: 'CashflowTransaction',
      transactionId: transaction.id,
      transactionNumber: transaction.transactionNumber,
      transactionSubType: transformCashflowTransactionType(
        transaction.transactionType
      ),
      referenceNumber: transaction.referenceNo,

      note: transaction.description,

      branchId: cashflowTransaction.branchId,
      userId: cashflowTransaction.userId,
    };
  };

  /**
   * Retrieves the cashflow debit GL entry.
   * @param {ICashflowTransaction} cashflowTransaction
   * @param {ICashflowTransactionLine} entry
   * @param {number} index
   * @returns {ILedgerEntry}
   */
  private getCashflowDebitGLEntry = (
    cashflowTransaction: ICashflowTransaction
  ): ILedgerEntry => {
    const commonEntry = this.getCommonEntry(cashflowTransaction);

    return {
      ...commonEntry,
      accountId: cashflowTransaction.cashflowAccountId,
      credit: cashflowTransaction.isCashCredit
        ? cashflowTransaction.localAmount
        : 0,
      debit: cashflowTransaction.isCashDebit
        ? cashflowTransaction.localAmount
        : 0,
      accountNormal: cashflowTransaction?.cashflowAccount?.accountNormal,
      index: 1,
    };
  };

  /**
   * Retrieves the cashflow credit GL entry.
   * @param {ICashflowTransaction} cashflowTransaction
   * @param {ICashflowTransactionLine} entry
   * @param {number} index
   * @returns {ILedgerEntry}
   */
  private getCashflowCreditGLEntry = (
    cashflowTransaction: ICashflowTransaction
  ): ILedgerEntry => {
    const commonEntry = this.getCommonEntry(cashflowTransaction);

    return {
      ...commonEntry,
      credit: cashflowTransaction.isCashDebit
        ? cashflowTransaction.localAmount
        : 0,
      debit: cashflowTransaction.isCashCredit
        ? cashflowTransaction.localAmount
        : 0,
      accountId: cashflowTransaction.creditAccountId,
      accountNormal: cashflowTransaction.creditAccount.accountNormal,
      index: 2,
    };
  };

  /**
   * Retrieves the cashflow transaction GL entry.
   * @param {ICashflowTransaction} cashflowTransaction
   * @param {ICashflowTransactionLine} entry
   * @param {number} index
   * @returns {ILedgerEntry[]}
   */
  private getJournalEntries = (
    cashflowTransaction: ICashflowTransaction
  ): ILedgerEntry[] => {
    const debitEntry = this.getCashflowDebitGLEntry(cashflowTransaction);
    const creditEntry = this.getCashflowCreditGLEntry(cashflowTransaction);

    return [debitEntry, creditEntry];
  };

  /**
   * Retrieves the cashflow GL ledger.
   * @param {ICashflowTransaction} cashflowTransaction
   * @returns {Ledger}
   */
  private getCashflowLedger = (cashflowTransaction: ICashflowTransaction) => {
    const entries = this.getJournalEntries(cashflowTransaction);
    return new Ledger(entries);
  };

  /**
   * Write the journal entries of the given cashflow transaction.
   * @param {number} tenantId
   * @param {ICashflowTransaction} cashflowTransaction
   * @return {Promise<void>}
   */
  public writeJournalEntries = async (
    tenantId: number,
    cashflowTransactionId: number,
    trx?: Knex.Transaction
  ): Promise<void> => {
    const { CashflowTransaction } = this.tenancy.models(tenantId);

    // Retrieves the cashflow transactions with associated entries.
    const transaction = await CashflowTransaction.query(trx)
      .findById(cashflowTransactionId)
      .withGraphFetched('cashflowAccount')
      .withGraphFetched('creditAccount');

    // Retrieves the cashflow transaction ledger.
    const ledger = this.getCashflowLedger(transaction);

    await this.ledgerStorage.commit(tenantId, ledger, trx);
  };

  /**
   * Delete the journal entries.
   * @param {number} tenantId - Tenant id.
   * @param {number} cashflowTransactionId - Cashflow transaction id.
   * @return {Promise<void>}
   */
  public revertJournalEntries = async (
    tenantId: number,
    cashflowTransactionId: number,
    trx?: Knex.Transaction
  ): Promise<void> => {
    await this.ledgerStorage.deleteByReference(
      tenantId,
      cashflowTransactionId,
      'CashflowTransaction',
      trx
    );
  };
}
