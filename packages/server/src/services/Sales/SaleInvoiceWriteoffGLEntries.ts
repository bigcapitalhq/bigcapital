import { Service } from 'typedi';
import { ISaleInvoice, AccountNormal, ILedgerEntry, ILedger } from '@/interfaces';
import Ledger from '@/services/Accounting/Ledger';

@Service()
export class SaleInvoiceWriteoffGLEntries {
  /**
   * Retrieves the invoice write-off common GL entry.
   * @param {ISaleInvoice} saleInvoice
   */
  private getInvoiceWriteoffGLCommonEntry = (saleInvoice: ISaleInvoice) => {
    return {
      date: saleInvoice.invoiceDate,

      currencyCode: saleInvoice.currencyCode,
      exchangeRate: saleInvoice.exchangeRate,

      transactionId: saleInvoice.id,
      transactionType: 'InvoiceWriteOff',
      transactionNumber: saleInvoice.invoiceNo,

      referenceNo: saleInvoice.referenceNo,
      branchId: saleInvoice.branchId,
    };
  };

  /**
   * Retrieves the invoice write-off receiveable GL entry.
   * @param   {number} ARAccountId
   * @param   {ISaleInvoice} saleInvoice
   * @returns {ILedgerEntry}
   */
  private getInvoiceWriteoffGLReceivableEntry = (
    ARAccountId: number,
    saleInvoice: ISaleInvoice
  ): ILedgerEntry => {
    const commonEntry = this.getInvoiceWriteoffGLCommonEntry(saleInvoice);

    return {
      ...commonEntry,
      credit: saleInvoice.localWrittenoffAmount,
      accountId: ARAccountId,
      contactId: saleInvoice.customerId,
      debit: 0,
      index: 1,
      indexGroup: 300,
      accountNormal: saleInvoice.writtenoffExpenseAccount.accountNormal,
    };
  };

  /**
   * Retrieves the invoice write-off expense GL entry.
   * @param   {ISaleInvoice} saleInvoice
   * @returns {ILedgerEntry}
   */
  private getInvoiceWriteoffGLExpenseEntry = (
    saleInvoice: ISaleInvoice
  ): ILedgerEntry => {
    const commonEntry = this.getInvoiceWriteoffGLCommonEntry(saleInvoice);

    return {
      ...commonEntry,
      debit: saleInvoice.localWrittenoffAmount,
      accountId: saleInvoice.writtenoffExpenseAccountId,
      credit: 0,
      index: 2,
      indexGroup: 300,
      accountNormal: AccountNormal.DEBIT,
    };
  };

  /**
   * Retrieves the invoice write-off GL entries.
   * @param   {number} ARAccountId
   * @param   {ISaleInvoice} saleInvoice
   * @returns {ILedgerEntry[]}
   */
  public getInvoiceWriteoffGLEntries = (
    ARAccountId: number,
    saleInvoice: ISaleInvoice
  ): ILedgerEntry[] => {
    const creditEntry = this.getInvoiceWriteoffGLExpenseEntry(saleInvoice);
    const debitEntry = this.getInvoiceWriteoffGLReceivableEntry(
      ARAccountId,
      saleInvoice
    );
    return [debitEntry, creditEntry];
  };

  /**
   * Retrieves the invoice write-off ledger.
   * @param   {number} ARAccountId
   * @param   {ISaleInvoice} saleInvoice
   * @returns {Ledger}
   */
  public getInvoiceWriteoffLedger = (
    ARAccountId: number,
    saleInvoice: ISaleInvoice
  ): ILedger => {
    const entries = this.getInvoiceWriteoffGLEntries(ARAccountId, saleInvoice);

    return new Ledger(entries);
  };
}
