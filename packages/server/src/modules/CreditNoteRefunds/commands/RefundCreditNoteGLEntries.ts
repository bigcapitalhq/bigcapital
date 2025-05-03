import { LedgerStorageService } from '@/modules/Ledger/LedgerStorage.service';
import { Inject, Injectable } from '@nestjs/common';
import { RefundCreditNote } from '../models/RefundCreditNote';
import { Ledger } from '@/modules/Ledger/Ledger';
import { Knex } from 'knex';
import { TenantModelProxy } from '@/modules/System/models/TenantBaseModel';
import { Account } from '@/modules/Accounts/models/Account.model';
import { ILedgerEntry } from '@/modules/Ledger/types/Ledger.types';
import { AccountNormal } from '@/interfaces/Account';

@Injectable()
export class RefundCreditNoteGLEntries {
  constructor(
    private readonly ledgerStorage: LedgerStorageService,

    @Inject(Account.name)
    private readonly accountModel: TenantModelProxy<typeof Account>,

    @Inject(RefundCreditNote.name)
    private readonly refundCreditNoteModel: TenantModelProxy<
      typeof RefundCreditNote
    >,
  ) {}

  /**
   * Retrieves the refund credit common GL entry.
   * @param {IRefundCreditNote} refundCreditNote
   * @returns
   */
  private getRefundCreditCommonGLEntry = (
    refundCreditNote: RefundCreditNote,
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
   * Retrieves the refudn credit receivable GL entry.
   * @param   {IRefundCreditNote} refundCreditNote
   * @param   {number} ARAccountId
   * @returns {ILedgerEntry}
   */
  private getRefundCreditGLReceivableEntry = (
    refundCreditNote: RefundCreditNote,
    ARAccountId: number,
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
    refundCreditNote: RefundCreditNote,
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
    refundCreditNote: RefundCreditNote,
    ARAccountId: number,
  ): ILedgerEntry[] {
    const receivableEntry = this.getRefundCreditGLReceivableEntry(
      refundCreditNote,
      ARAccountId,
    );
    const withdrawalEntry =
      this.getRefundCreditGLWithdrawalEntry(refundCreditNote);

    return [receivableEntry, withdrawalEntry];
  }

  /**
   * Creates refund credit GL entries.
   * @param {IRefundCreditNote} refundCreditNote
   * @param {Knex.Transaction} trx
   */
  public createRefundCreditGLEntries = async (
    refundCreditNoteId: number,
    trx?: Knex.Transaction,
  ) => {
    // Retrieve the refund with associated credit note.
    const refundCreditNote = await this.refundCreditNoteModel().query(trx)
      .findById(refundCreditNoteId)
      .withGraphFetched('creditNote');

    // Receivable account A/R.
    const receivableAccount = await this.accountModel().query().findOne(
      'slug',
      'accounts-receivable',
    );
    // Retrieve refund credit GL entries.
    const refundGLEntries = this.getRefundCreditGLEntries(
      refundCreditNote,
      receivableAccount.id,
    );
    const ledger = new Ledger(refundGLEntries);

    // Saves refund ledger entries.
    await this.ledgerStorage.commit(ledger, trx);
  };

  /**
   * Reverts refund credit note GL entries.
   * @param {number} refundCreditNoteId
   * @param {number} receivableAccount
   * @param {Knex.Transaction} trx
   */
  public revertRefundCreditGLEntries = async (
    refundCreditNoteId: number,
    trx?: Knex.Transaction,
  ) => {
    await this.ledgerStorage.deleteByReference(
      refundCreditNoteId,
      'RefundCreditNote',
      trx,
    );
  };
}
