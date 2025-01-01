import * as R from 'ramda';
import { ILedger } from '@/modules/Ledger/types/Ledger.types';
import { AccountNormal } from '@/modules/Accounts/Accounts.types';
import { ILedgerEntry } from '@/modules/Ledger/types/Ledger.types';
import { ItemEntry } from '@/modules/TransactionItemEntry/models/ItemEntry';
import { Ledger } from '@/modules/Ledger/Ledger';
import { SaleInvoice } from '../models/SaleInvoice';

export class InvoiceGL {
  private saleInvoice: SaleInvoice;
  private ARAccountId: number;
  private taxPayableAccountId: number;
  private discountAccountId: number;
  private otherChargesAccountId: number;

  /**
   * Constructor method.
   * @param {SaleInvoice} saleInvoice - Sale invoice.
   */
  constructor(saleInvoice: SaleInvoice) {
    this.saleInvoice = saleInvoice;
  }

  /**
   * Set the receivable account id.
   * @param {number} ARAccountId - Receivable account id.
   */
  setARAccountId(ARAccountId: number) {
    this.ARAccountId = ARAccountId;
  }

  /**
   * Set the tax payable account id.
   * @param {number} taxPayableAccountId - Tax payable account id.
   */
  setTaxPayableAccountId(taxPayableAccountId: number) {
    this.taxPayableAccountId = taxPayableAccountId;
  }

  /**
   * Set the discount account id.
   * @param {number} discountAccountId - Discount account id.
   */
  setDiscountAccountId(discountAccountId: number) {
    this.discountAccountId = discountAccountId;
  }

  /**
   * Set the other charges account id.
   * @param {number} otherChargesAccountId - Other charges account id.
   */
  setOtherChargesAccountId(otherChargesAccountId: number) {
    this.otherChargesAccountId = otherChargesAccountId;
  }

  /**
   * Retrieves the invoice GL common entry.
   */
  private get invoiceGLCommonEntry() {
    return {
      credit: 0,
      debit: 0,

      currencyCode: this.saleInvoice.currencyCode,
      exchangeRate: this.saleInvoice.exchangeRate,

      transactionType: 'SaleInvoice',
      transactionId: this.saleInvoice.id,

      date: this.saleInvoice.invoiceDate,
      userId: this.saleInvoice.userId,

      transactionNumber: this.saleInvoice.invoiceNo,
      referenceNumber: this.saleInvoice.referenceNo,

      createdAt: this.saleInvoice.createdAt,
      indexGroup: 10,

      branchId: this.saleInvoice.branchId,
    };
  }

  /**
   * Retrieve receivable entry of the invoice.
   * @returns {ILedgerEntry}
   */
  public get invoiceReceivableEntry(): ILedgerEntry {
    const commonEntry = this.invoiceGLCommonEntry;

    return {
      ...commonEntry,
      debit: this.saleInvoice.totalLocal,
      accountId: this.ARAccountId,
      contactId: this.saleInvoice.customerId,
      accountNormal: AccountNormal.DEBIT,
      index: 1,
    };
  }

  /**
   * Retrieve item income entry of the invoice.
   * @param {ItemEntry} entry - Item entry.
   * @param {number} index - Index.
   * @returns {ILedgerEntry}
   */
  private getInvoiceItemEntry = R.curry(
    (entry: ItemEntry, index: number): ILedgerEntry => {
      const commonEntry = this.invoiceGLCommonEntry;
      const localAmount =
        entry.totalExcludingTax * this.saleInvoice.exchangeRate;

      return {
        ...commonEntry,
        credit: localAmount,
        accountId: entry.sellAccountId,
        note: entry.description,
        index: index + 2,
        itemId: entry.itemId,
        accountNormal: AccountNormal.CREDIT,
        taxRateId: entry.taxRateId,
        taxRate: entry.taxRate,
      };
    },
  );

  /**
   * Retreives the GL entry of tax payable.
   * @param {ItemEntry} entry - Item entry.
   * @param {number} index - Index.
   * @returns {ILedgerEntry}
   */
  private getInvoiceTaxEntry(entry: ItemEntry, index: number): ILedgerEntry {
    const commonEntry = this.invoiceGLCommonEntry;

    return {
      ...commonEntry,
      credit: entry.taxAmount,
      accountId: this.taxPayableAccountId,
      index: index + 1,
      indexGroup: 30,
      accountNormal: AccountNormal.CREDIT,
      taxRateId: entry.taxRateId,
      taxRate: entry.taxRate,
    };
  }

  /**
   * Retrieves the invoice discount GL entry.
   * @returns {ILedgerEntry}
   */
  private get invoiceDiscountEntry(): ILedgerEntry {
    const commonEntry = this.invoiceGLCommonEntry;

    return {
      ...commonEntry,
      debit: this.saleInvoice.discountAmountLocal,
      accountId: this.discountAccountId,
      accountNormal: AccountNormal.CREDIT,
      index: 1,
    } as ILedgerEntry;
  };

  /**
   * Retrieves the invoice adjustment GL entry.
   * @returns {ILedgerEntry}
   */
  private get adjustmentEntry(): ILedgerEntry {
    const commonEntry = this.invoiceGLCommonEntry;
    const adjustmentAmount = Math.abs(this.saleInvoice.adjustmentLocal);

    return {
      ...commonEntry,
      debit: this.saleInvoice.adjustmentLocal < 0 ? adjustmentAmount : 0,
      credit: this.saleInvoice.adjustmentLocal > 0 ? adjustmentAmount : 0,
      accountId: this.otherChargesAccountId,
      accountNormal: AccountNormal.CREDIT,
      index: 1,
    };
  };

  /**
   * Retrieves the invoice GL entries.
   * @returns {ILedgerEntry[]}
   */
  public getInvoiceGLEntries = (): ILedgerEntry[] => {
    const creditEntries = this.saleInvoice.entries.map(
      (entry, index) => this.getInvoiceItemEntry(entry, index),
    );
    const taxEntries = this.saleInvoice.entries
      .filter((entry) => entry.taxAmount > 0)
      .map((entry, index) => this.getInvoiceTaxEntry(entry, index));

    return [
      this.invoiceReceivableEntry,
      ...creditEntries,
      ...taxEntries,
      this.invoiceDiscountEntry,
      this.adjustmentEntry,
    ];
  };

  /**
   * Retrieves the invoice ledger.
   * @returns {ILedger}
   */
  public getInvoiceLedger = (): ILedger => {
    const entries = this.getInvoiceGLEntries();

    return new Ledger(entries);
  };
}
