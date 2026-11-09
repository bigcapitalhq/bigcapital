import { defaultTo } from 'lodash';
import { ILedgerEntry } from '@/modules/Ledger/types/Ledger.types';
import { Ledger } from '@/modules/Ledger/Ledger';
import { AccountNormal } from '@/interfaces/Account';
import { AccountingBasis } from '@/common/types/AccountingBasis';
import { ItemEntry } from '@/modules/TransactionItemEntry/models/ItemEntry';
import { RefundCreditNote } from '../models/RefundCreditNote';

/**
 * Records the cash basis journal entries of the credit note refund.
 * The cash basis reverses the income previously recognized on payments
 * when the credit note is actually refunded in cash.
 *
 * The entries mirror the income composition of the credit note (the income
 * accounts, discount, and other charges) scaled by the refunded proportion
 * of the credit note.
 */
export class RefundCreditNoteCashGL {
  private readonly refundCreditNote: RefundCreditNote;

  private discountAccountId: number;
  private adjustmentAccountId: number;

  /**
   * Constructor method.
   * @param {RefundCreditNote} refundCreditNote - Refund credit note.
   */
  constructor(refundCreditNote: RefundCreditNote) {
    this.refundCreditNote = refundCreditNote;
  }

  /**
   * Sets the discount account id.
   * @param {number} discountAccountId - Discount account id.
   * @returns {RefundCreditNoteCashGL}
   */
  setDiscountAccountId(discountAccountId: number) {
    this.discountAccountId = discountAccountId;
    return this;
  }

  /**
   * Sets the other charges (adjustment) account id.
   * @param {number} adjustmentAccountId - Adjustment account id.
   * @returns {RefundCreditNoteCashGL}
   */
  setAdjustmentAccountId(adjustmentAccountId: number) {
    this.adjustmentAccountId = adjustmentAccountId;
    return this;
  }

  /**
   * Retrieves the common journal entry of the cash basis entries.
   */
  private get cashEntriesCommonEntry() {
    return {
      credit: 0,
      debit: 0,

      currencyCode: this.refundCreditNote.currencyCode,
      exchangeRate: this.refundCreditNote.exchangeRate,

      transactionId: this.refundCreditNote.id,
      transactionType: 'RefundCreditNote',

      referenceNumber: this.refundCreditNote.referenceNo,

      date: this.refundCreditNote.date,
      createdAt: this.refundCreditNote.createdAt,

      note: this.refundCreditNote.description,
      branchId: this.refundCreditNote.branchId,

      indexGroup: 50,

      basis: AccountingBasis.Cash,
    };
  }

  /**
   * Retrieves the refunded proportion of the credit note.
   * The refund amount over the credit note total in local currency keeps
   * the cash basis entries balanced for partial refunds.
   * @returns {number}
   */
  private get refundRatio(): number {
    const creditNoteTotalLocal = defaultTo(
      this.refundCreditNote.creditNote?.totalLocal,
      0,
    );

    if (creditNoteTotalLocal <= 0) {
      return 0;
    }
    return this.refundCreditNote.amount / creditNoteTotalLocal;
  }

  /**
   * Retrieves the withdrawal account (cash/bank) credit entry.
   * @returns {ILedgerEntry}
   */
  private get refundEntry(): ILedgerEntry {
    return {
      ...this.cashEntriesCommonEntry,
      credit: this.refundCreditNote.amount,
      accountId: this.refundCreditNote.fromAccountId,
      index: 1,
      accountNormal: AccountNormal.DEBIT,
    };
  }

  /**
   * Retrieves the cash basis entry of the given credit note item.
   * @param {ItemEntry} item - Credit note item entry.
   * @param {number} index - Item entry index.
   * @returns {ILedgerEntry}
   */
  private getCreditNoteItemEntry(item: ItemEntry, index: number): ILedgerEntry {
    const commonEntry = this.cashEntriesCommonEntry;
    const exchangeRate = defaultTo(
      this.refundCreditNote.creditNote?.exchangeRate,
      1,
    );

    return {
      ...commonEntry,
      debit: item.totalExcludingTax * exchangeRate * this.refundRatio,
      accountId: item.sellAccountId || item.item.sellAccountId,
      note: item.description,
      index: index + 2,
      itemId: item.itemId,
      accountNormal: AccountNormal.CREDIT,
    };
  }

  /**
   * Retrieves the discount entry mirroring the credit note discount.
   * @returns {ILedgerEntry[]}
   */
  private get discountEntry(): ILedgerEntry[] {
    const discountAmountLocal =
      this.refundCreditNote.creditNote?.discountAmountLocal;

    if (!discountAmountLocal) {
      return [];
    }
    return [
      {
        ...this.cashEntriesCommonEntry,
        credit: discountAmountLocal * this.refundRatio,
        accountId: this.discountAccountId,
        accountNormal: AccountNormal.CREDIT,
        index: 1,
      },
    ];
  }

  /**
   * Retrieves the other charges (adjustment) entry mirroring the credit note.
   * @returns {ILedgerEntry[]}
   */
  private get adjustmentEntry(): ILedgerEntry[] {
    const adjustmentLocal = this.refundCreditNote.creditNote?.adjustmentLocal;

    if (!adjustmentLocal) {
      return [];
    }
    const adjustmentAmount = Math.abs(adjustmentLocal) * this.refundRatio;

    return [
      {
        ...this.cashEntriesCommonEntry,
        credit: adjustmentLocal < 0 ? adjustmentAmount : 0,
        debit: adjustmentLocal > 0 ? adjustmentAmount : 0,
        accountId: this.adjustmentAccountId,
        accountNormal: AccountNormal.CREDIT,
        index: 1,
      },
    ];
  }

  /**
   * Retrieves the refund credit note cash basis GL entries.
   * @returns {ILedgerEntry[]}
   */
  public GLEntries(): ILedgerEntry[] {
    const creditNote = this.refundCreditNote.creditNote;

    if (!creditNote || this.refundRatio <= 0) {
      return [];
    }
    const itemsEntries = (creditNote.entries || []).map((item, index) =>
      this.getCreditNoteItemEntry(item, index),
    );

    return [
      this.refundEntry,
      ...this.discountEntry,
      ...this.adjustmentEntry,
      ...itemsEntries,
    ];
  }

  /**
   * Retrieves the refund credit note cash basis ledger.
   * @returns {Ledger}
   */
  public getLedger = (): Ledger => {
    return new Ledger(this.GLEntries());
  };
}
