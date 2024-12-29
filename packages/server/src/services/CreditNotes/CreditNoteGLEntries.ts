import { Inject, Service } from 'typedi';
import { Knex } from 'knex';
import * as R from 'ramda';
import {
  AccountNormal,
  IItemEntry,
  ILedgerEntry,
  ICreditNote,
  ILedger,
  ICreditNoteGLCommonEntry,
} from '@/interfaces';
import HasTenancyService from '@/services/Tenancy/TenancyService';
import Ledger from '@/services/Accounting/Ledger';
import LedgerStorageService from '@/services/Accounting/LedgerStorageService';
import { SaleReceipt } from '@/models';

@Service()
export default class CreditNoteGLEntries {
  @Inject()
  private tenancy: HasTenancyService;

  @Inject()
  private ledgerStorage: LedgerStorageService;

  /**
   * Retrieves the credit note GL.
   * @param   {ICreditNote} creditNote
   * @param   {number} receivableAccount
   * @returns {Ledger}
   */
  private getCreditNoteGLedger = (
    creditNote: ICreditNote,
    receivableAccount: number,
    discountAccount: number,
    adjustmentAccount: number
  ): Ledger => {
    const ledgerEntries = this.getCreditNoteGLEntries(
      creditNote,
      receivableAccount,
      discountAccount,
      adjustmentAccount
    );
    return new Ledger(ledgerEntries);
  };

  /**
   * Saves credit note GL entries.
   * @param {number} tenantId -
   * @param {ICreditNote} creditNote - Credit note model.
   * @param {number} payableAccount - Payable account id.
   * @param {Knex.Transaction} trx
   */
  public saveCreditNoteGLEntries = async (
    tenantId: number,
    creditNote: ICreditNote,
    payableAccount: number,
    discountAccount: number,
    adjustmentAccount: number,
    trx?: Knex.Transaction
  ): Promise<void> => {
    const ledger = this.getCreditNoteGLedger(
      creditNote,
      payableAccount,
      discountAccount,
      adjustmentAccount
    );

    await this.ledgerStorage.commit(tenantId, ledger, trx);
  };

  /**
   * Reverts the credit note associated GL entries.
   * @param {number} tenantId
   * @param {number} vendorCreditId
   * @param {Knex.Transaction} trx
   */
  public revertVendorCreditGLEntries = async (
    tenantId: number,
    creditNoteId: number,
    trx?: Knex.Transaction
  ): Promise<void> => {
    await this.ledgerStorage.deleteByReference(
      tenantId,
      creditNoteId,
      'CreditNote',
      trx
    );
  };

  /**
   * Writes vendor credit associated GL entries.
   * @param {number} tenantId - Tenant id.
   * @param {number} creditNoteId - Credit note id.
   * @param {Knex.Transaction} trx - Knex transactions.
   */
  public createVendorCreditGLEntries = async (
    tenantId: number,
    creditNoteId: number,
    trx?: Knex.Transaction
  ): Promise<void> => {
    const { CreditNote } = this.tenancy.models(tenantId);
    const { accountRepository } = this.tenancy.repositories(tenantId);

    // Retrieve the credit note with associated entries and items.
    const creditNoteWithItems = await CreditNote.query(trx)
      .findById(creditNoteId)
      .withGraphFetched('entries.item');

    // Retreive the the `accounts receivable` account based on the given currency.
    const ARAccount = await accountRepository.findOrCreateAccountReceivable(
      creditNoteWithItems.currencyCode
    );
    const discountAccount = await accountRepository.findOrCreateDiscountAccount(
      {}
    );
    const adjustmentAccount =
      await accountRepository.findOrCreateOtherChargesAccount({});
    // Saves the credit note GL entries.
    await this.saveCreditNoteGLEntries(
      tenantId,
      creditNoteWithItems,
      ARAccount.id,
      discountAccount.id,
      adjustmentAccount.id,
      trx
    );
  };

  /**
   * Edits vendor credit associated GL entries.
   * @param {number} tenantId
   * @param {number} creditNoteId
   * @param {Knex.Transaction} trx
   */
  public editVendorCreditGLEntries = async (
    tenantId: number,
    creditNoteId: number,
    trx?: Knex.Transaction
  ): Promise<void> => {
    // Reverts vendor credit GL entries.
    await this.revertVendorCreditGLEntries(tenantId, creditNoteId, trx);

    // Creates vendor credit Gl entries.
    await this.createVendorCreditGLEntries(tenantId, creditNoteId, trx);
  };

  /**
   * Retrieve the credit note common entry.
   * @param   {ICreditNote} creditNote -
   * @returns {ICreditNoteGLCommonEntry}
   */
  private getCreditNoteCommonEntry = (
    creditNote: ICreditNote
  ): ICreditNoteGLCommonEntry => {
    return {
      date: creditNote.creditNoteDate,
      userId: creditNote.userId,
      currencyCode: creditNote.currencyCode,
      exchangeRate: creditNote.exchangeRate,

      transactionType: 'CreditNote',
      transactionId: creditNote.id,

      transactionNumber: creditNote.creditNoteNumber,
      referenceNumber: creditNote.referenceNo,

      createdAt: creditNote.createdAt,
      indexGroup: 10,

      credit: 0,
      debit: 0,

      branchId: creditNote.branchId,
    };
  };

  /**
   * Retrieves the creidt note A/R entry.
   * @param   {ICreditNote} creditNote -
   * @param   {number} ARAccountId -
   * @returns {ILedgerEntry}
   */
  private getCreditNoteAREntry = (
    creditNote: ICreditNote,
    ARAccountId: number
  ): ILedgerEntry => {
    const commonEntry = this.getCreditNoteCommonEntry(creditNote);

    return {
      ...commonEntry,
      credit: creditNote.totalLocal,
      accountId: ARAccountId,
      contactId: creditNote.customerId,
      index: 1,
      accountNormal: AccountNormal.DEBIT,
    };
  };

  /**
   * Retrieve the credit note item entry.
   * @param   {ICreditNote} creditNote
   * @param   {IItemEntry} entry
   * @param   {number} index
   * @returns {ILedgerEntry}
   */
  private getCreditNoteItemEntry = R.curry(
    (
      creditNote: ICreditNote,
      entry: IItemEntry,
      index: number
    ): ILedgerEntry => {
      const commonEntry = this.getCreditNoteCommonEntry(creditNote);
      const totalLocal = entry.totalExcludingTax * creditNote.exchangeRate;

      return {
        ...commonEntry,
        debit: totalLocal,
        accountId: entry.sellAccountId || entry.item.sellAccountId,
        note: entry.description,
        index: index + 2,
        itemId: entry.itemId,
        itemQuantity: entry.quantity,
        accountNormal: AccountNormal.CREDIT,
      };
    }
  );

  /**
   * Retrieves the credit note discount entry.
   * @param {ICreditNote} creditNote
   * @param {number} discountAccountId
   * @returns {ILedgerEntry}
   */
  private getDiscountEntry = (
    creditNote: ICreditNote,
    discountAccountId: number
  ): ILedgerEntry => {
    const commonEntry = this.getCreditNoteCommonEntry(creditNote);

    return {
      ...commonEntry,
      credit: creditNote.discountAmountLocal,
      accountId: discountAccountId,
      index: 1,
      accountNormal: AccountNormal.CREDIT,
    };
  };

  /**
   * Retrieves the credit note adjustment entry.
   * @param {ICreditNote} creditNote
   * @param {number} adjustmentAccountId
   * @returns {ILedgerEntry}
   */
  private getAdjustmentEntry = (
    creditNote: ICreditNote,
    adjustmentAccountId: number
  ): ILedgerEntry => {
    const commonEntry = this.getCreditNoteCommonEntry(creditNote);
    const adjustmentAmount = Math.abs(creditNote.adjustmentLocal);

    return {
      ...commonEntry,
      credit: creditNote.adjustmentLocal < 0 ? adjustmentAmount : 0,
      debit: creditNote.adjustmentLocal > 0 ? adjustmentAmount : 0,
      accountId: adjustmentAccountId,
      accountNormal: AccountNormal.CREDIT,
      index: 1,
    };
  };

  /**
   * Retrieve the credit note GL entries.
   * @param   {ICreditNote} creditNote - Credit note.
   * @param   {IAccount} receivableAccount - Receviable account.
   * @returns {ILedgerEntry[]} - Ledger entries.
   */
  public getCreditNoteGLEntries = (
    creditNote: ICreditNote,
    ARAccountId: number,
    discountAccountId: number,
    adjustmentAccountId: number
  ): ILedgerEntry[] => {
    const AREntry = this.getCreditNoteAREntry(creditNote, ARAccountId);

    const getItemEntry = this.getCreditNoteItemEntry(creditNote);
    const itemsEntries = creditNote.entries.map(getItemEntry);

    const discountEntry = this.getDiscountEntry(creditNote, discountAccountId);
    const adjustmentEntry = this.getAdjustmentEntry(
      creditNote,
      adjustmentAccountId
    );

    return [AREntry, discountEntry, adjustmentEntry, ...itemsEntries];
  };
}
