import { SaleInvoice } from '../../models/SaleInvoice';
import { ILedger } from '@/modules/Ledger/types/Ledger.types';
import { ILedgerEntry } from '@/modules/Ledger/types/Ledger.types';
import { AccountNormal } from '@/interfaces/Account';
import { Ledger } from '@/modules/Ledger/Ledger';

export class SaleInvoiceWriteoffGL {
  private saleInvoiceModel: SaleInvoice;
  private ARAccountId: number;

  /**
   * Sets the sale invoice model.
   * @param {SaleInvoice} saleInvoiceModel -
   */
  constructor(saleInvoiceModel: SaleInvoice) {
    this.saleInvoiceModel = saleInvoiceModel;
  }

  /**
   * Sets the A/R account ID.
   * @param {number} ARAccountId -
   */
  setARAccountId(ARAccountId: number) {
    this.ARAccountId = ARAccountId;
    return this;
  }

  /**
   * Retrieves the invoice write-off common GL entry.
   * @param {ISaleInvoice} saleInvoice
   */
  private get invoiceWriteoffGLCommonEntry() {
    return {
      date: this.saleInvoiceModel.invoiceDate,

      currencyCode: this.saleInvoiceModel.currencyCode,
      exchangeRate: this.saleInvoiceModel.exchangeRate,

      transactionId: this.saleInvoiceModel.id,
      transactionType: 'InvoiceWriteOff',
      transactionNumber: this.saleInvoiceModel.invoiceNo,

      referenceNo: this.saleInvoiceModel.referenceNo,
      branchId: this.saleInvoiceModel.branchId,
    };
  }

  /**
   * Retrieves the invoice write-off receiveable GL entry.
   * @param {number} ARAccountId
   * @param {ISaleInvoice} saleInvoice
   * @returns {ILedgerEntry}
   */
  private get invoiceWriteoffGLReceivableEntry(): ILedgerEntry {
    const commontEntry = this.invoiceWriteoffGLCommonEntry;

    return {
      ...commontEntry,
      credit: this.saleInvoiceModel.localWrittenoffAmount,
      accountId: this.ARAccountId,
      contactId: this.saleInvoiceModel.customerId,
      debit: 0,
      index: 1,
      indexGroup: 300,
      accountNormal:
        this.saleInvoiceModel.writtenoffExpenseAccount.accountNormal,
    };
  }

  /**
   * Retrieves the invoice write-off expense GL entry.
   * @param {ISaleInvoice} saleInvoice
   * @returns {ILedgerEntry}
   */
  private get invoiceWriteoffGLExpenseEntry(): ILedgerEntry {
    const commontEntry = this.invoiceWriteoffGLCommonEntry;

    return {
      ...commontEntry,
      debit: this.saleInvoiceModel.writtenoffAmount,
      accountId: this.saleInvoiceModel.writtenoffExpenseAccountId,
      credit: 0,
      index: 2,
      indexGroup: 300,
      accountNormal: AccountNormal.DEBIT,
    };
  }

  /**
   * Retrieves the invoice write-off GL entries.
   * @returns {ILedgerEntry[]}
   */
  public getInvoiceWriteoffGLEntries(): ILedgerEntry[] {
    const creditEntry = this.invoiceWriteoffGLExpenseEntry;
    const debitEntry = this.invoiceWriteoffGLReceivableEntry;

    return [debitEntry, creditEntry];
  }

  /**
   * Retrieves the invoice write-off ledger.
   * @param {number} ARAccountId
   * @param {ISaleInvoice} saleInvoice
   * @returns {Ledger}
   */
  public getInvoiceWriteoffLedger(): ILedger {
    const entries = this.getInvoiceWriteoffGLEntries();

    return new Ledger(entries);
  }
}
