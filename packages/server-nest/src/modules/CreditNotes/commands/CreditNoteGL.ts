import { ILedgerEntry } from '@/modules/Ledger/types/Ledger.types';
import { CreditNote } from '../models/CreditNote';
import { AccountNormal } from '@/interfaces/Account';
import { Ledger } from '@/modules/Ledger/Ledger';
import { ItemEntry } from '@/modules/TransactionItemEntry/models/ItemEntry';

export class CreditNoteGL {
  creditNoteModel: CreditNote;
  ARAccountId: number;
  discountAccountId: number;
  adjustmentAccountId: number;

  /**
   * @param {CreditNote} creditNoteModel - Credit note model.
   */
  constructor(creditNoteModel: CreditNote) {
    this.creditNoteModel = creditNoteModel;
  }

  /**
   * Sets the A/R account id.
   * @param {number} ARAccountId - A/R account id.
   */
  public setARAccountId(ARAccountId: number) {
    this.ARAccountId = ARAccountId;
    return this;
  }

  /**
   * Sets the discount account id.
   * @param {number} discountAccountId - Discount account id.
   */
  public setDiscountAccountId(discountAccountId: number) {
    this.discountAccountId = discountAccountId;
    return this;
  }

  /**
   * Sets the adjustment account id.
   * @param {number} adjustmentAccountId - Adjustment account id.
   */
  public setAdjustmentAccountId(adjustmentAccountId: number) {
    this.adjustmentAccountId = adjustmentAccountId;
    return this;
  }

  /**
   * Retrieve the credit note common entry.
   * @returns {ICreditNoteGLCommonEntry}
   */
  private get creditNoteCommonEntry() {
    return {
      date: this.creditNoteModel.creditNoteDate,
      userId: this.creditNoteModel.userId,
      currencyCode: this.creditNoteModel.currencyCode,
      exchangeRate: this.creditNoteModel.exchangeRate,

      transactionType: 'CreditNote',
      transactionId: this.creditNoteModel.id,

      transactionNumber: this.creditNoteModel.creditNoteNumber,
      referenceNumber: this.creditNoteModel.referenceNo,

      createdAt: this.creditNoteModel.createdAt,
      indexGroup: 10,

      credit: 0,
      debit: 0,

      branchId: this.creditNoteModel.branchId,
    };
  }

  /**
   * Retrieves the creidt note A/R entry.
   * @param   {ICreditNote} creditNote -
   * @param   {number} ARAccountId -
   * @returns {ILedgerEntry}
   */
  private get creditNoteAREntry() {
    const commonEntry = this.creditNoteCommonEntry;

    return {
      ...commonEntry,
      credit: this.creditNoteModel.totalLocal,
      accountId: this.ARAccountId,
      contactId: this.creditNoteModel.customerId,
      index: 1,
      accountNormal: AccountNormal.DEBIT,
    };
  }

  /**
   * Retrieve the credit note item entry.
   * @param {ItemEntry} entry
   * @param {number} index
   * @returns {ILedgerEntry}
   */
  private getCreditNoteItemEntry(
    entry: ItemEntry,
    index: number,
  ): ILedgerEntry {
    const commonEntry = this.creditNoteCommonEntry;
    const totalLocal =
      entry.totalExcludingTax * this.creditNoteModel.exchangeRate;

    return {
      ...commonEntry,
      debit: totalLocal,
      accountId: entry.sellAccountId || entry.item.sellAccountId,
      note: entry.description,
      index: index + 2,
      itemId: entry.itemId,
      accountNormal: AccountNormal.CREDIT,
    };
  }

  /**
   * Retrieves the credit note discount entry.
   * @param {ICreditNote} creditNote
   * @param {number} discountAccountId
   * @returns {ILedgerEntry}
   */
  private get discountEntry(): ILedgerEntry {
    const commonEntry = this.creditNoteCommonEntry;

    return {
      ...commonEntry,
      credit: this.creditNoteModel.discountAmountLocal,
      accountId: this.discountAccountId,
      accountNormal: AccountNormal.CREDIT,
      index: 1,
    };
  }

  /**
   * Retrieves the credit note adjustment entry.
   * @param {ICreditNote} creditNote
   * @param {number} adjustmentAccountId
   * @returns {ILedgerEntry}
   */
  private get adjustmentEntry(): ILedgerEntry {
    const commonEntry = this.creditNoteCommonEntry;
    const adjustmentAmount = Math.abs(this.creditNoteModel.adjustmentLocal);

    return {
      ...commonEntry,
      credit: this.creditNoteModel.adjustmentLocal < 0 ? adjustmentAmount : 0,
      debit: this.creditNoteModel.adjustmentLocal > 0 ? adjustmentAmount : 0,
      accountId: this.adjustmentAccountId,
      accountNormal: AccountNormal.CREDIT,
      index: 1,
    };
  }

  /**
   * Retrieve the credit note GL entries.
   * @param {ICreditNote} creditNote - Credit note.
   * @param {IAccount} receivableAccount - Receviable account.
   * @returns {ILedgerEntry[]} - Ledger entries.
   */
  public getCreditNoteGLEntries(): ILedgerEntry[] {
    const AREntry = this.creditNoteAREntry;

    const itemsEntries = this.creditNoteModel.entries.map((entry, index) =>
      this.getCreditNoteItemEntry(entry, index),
    );
    const discountEntry = this.discountEntry;
    const adjustmentEntry = this.adjustmentEntry;

    return [AREntry, discountEntry, adjustmentEntry, ...itemsEntries];
  }

  /**
   * Retrieves the credit note GL.
   * @param   {ICreditNote} creditNote
   * @param   {number} receivableAccount
   * @returns {Ledger}
   */
  public getCreditNoteLedger(): Ledger {
    const ledgerEntries = this.getCreditNoteGLEntries();

    return new Ledger(ledgerEntries);
  }
}
