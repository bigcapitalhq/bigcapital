import { Inject, Service } from 'typedi';
import { Knex } from 'knex';
import { AccountNormal, ILedgerEntry, IRefundCreditNote } from '@/interfaces';
import HasTenancyService from '@/services/Tenancy/TenancyService';
import LedgerStorageService from '@/services/Accounting/LedgerStorageService';
import Ledger from '@/services/Accounting/Ledger';

@Service()
export default class RefundCreditNoteGLEntries {
  @Inject()
  ledgerStorage: LedgerStorageService;

  @Inject()
  tenancy: HasTenancyService;

  /**
   * Retrieves the refund credit common GL entry.
   * @param {IRefundCreditNote} refundCreditNote
   * @returns
   */
  private getRefundCreditCommonGLEntry = (
    refundCreditNote: IRefundCreditNote
  ) => {
    return {
      currencyCode: refundCreditNote.currencyCode,
      exchangeRate: refundCreditNote.exchangeRate,

      transactionType: 'RefundCreditNote',
      transactionId: refundCreditNote.id,
      date: refundCreditNote.date,
      userId: refundCreditNote.userId,

      referenceNumber: refundCreditNote.referenceNo,

      createdAt: refundCreditNote.createdAt,
      indexGroup: 10,

      credit: 0,
      debit: 0,

      note: refundCreditNote.description,
      branchId: refundCreditNote.branchId,
    };
  };

  /**
   * Retrieves the refund credit receivable GL entry.
   * @param   {IRefundCreditNote} refundCreditNote
   * @param   {number} ARAccountId
   * @returns {ILedgerEntry}
   */
  private getRefundCreditGLReceivableEntry = (
    refundCreditNote: IRefundCreditNote,
    ARAccountId: number
  ): ILedgerEntry => {
    const commonEntry = this.getRefundCreditCommonGLEntry(refundCreditNote);

    return {
      ...commonEntry,
      debit: refundCreditNote.amount,
      accountId: ARAccountId,
      contactId: refundCreditNote.creditNote.customerId,
      index: 1,
      accountNormal: AccountNormal.DEBIT,
    };
  };

  /**
   * Retrieves the refund credit withdrawal GL entry.
   * @param   {number} refundCreditNote
   * @returns {ILedgerEntry}
   */
  private getRefundCreditGLWithdrawalEntry = (
    refundCreditNote: IRefundCreditNote
  ): ILedgerEntry => {
    const commonEntry = this.getRefundCreditCommonGLEntry(refundCreditNote);

    return {
      ...commonEntry,
      credit: refundCreditNote.amount,
      accountId: refundCreditNote.fromAccountId,
      index: 2,
      accountNormal: AccountNormal.DEBIT,
    };
  };

  /**
   * Retrieve the refund credit note GL entries.
   * @param {IRefundCreditNote} refundCreditNote
   * @param {number} receivableAccount
   * @returns {ILedgerEntry[]}
   */
  public getRefundCreditGLEntries(
    refundCreditNote: IRefundCreditNote,
    ARAccountId: number
  ): ILedgerEntry[] {
    const receivableEntry = this.getRefundCreditGLReceivableEntry(
      refundCreditNote,
      ARAccountId
    );
    const withdrawalEntry =
      this.getRefundCreditGLWithdrawalEntry(refundCreditNote);

    return [receivableEntry, withdrawalEntry];
  }

  /**
   * Creates refund credit GL entries.
   * @param {number} tenantId
   * @param {IRefundCreditNote} refundCreditNote
   * @param {Knex.Transaction} trx
   */
  public createRefundCreditGLEntries = async (
    tenantId: number,
    refundCreditNoteId: number,
    trx?: Knex.Transaction
  ) => {
    const { Account, RefundCreditNote } = this.tenancy.models(tenantId);

    // Retrieve the refund with associated credit note.
    const refundCreditNote = await RefundCreditNote.query(trx)
      .findById(refundCreditNoteId)
      .withGraphFetched('creditNote');

    // Receivable account A/R.
    const receivableAccount = await Account.query().findOne(
      'slug',
      'accounts-receivable'
    );
    // Retrieve refund credit GL entries.
    const refundGLEntries = this.getRefundCreditGLEntries(
      refundCreditNote,
      receivableAccount.id
    );
    const ledger = new Ledger(refundGLEntries);

    // Saves refund ledger entries.
    await this.ledgerStorage.commit(tenantId, ledger, trx);
  };

  /**
   * Reverts refund credit note GL entries.
   * @param {number} tenantId
   * @param {number} refundCreditNoteId
   * @param {number} receivableAccount
   * @param {Knex.Transaction} trx
   */
  public revertRefundCreditGLEntries = async (
    tenantId: number,
    refundCreditNoteId: number,
    trx?: Knex.Transaction
  ) => {
    await this.ledgerStorage.deleteByReference(
      tenantId,
      refundCreditNoteId,
      'RefundCreditNote',
      trx
    );
  };
}
