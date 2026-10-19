import { LedgerStorageService } from '@/modules/Ledger/LedgerStorage.service';
import { Inject, Injectable } from '@nestjs/common';
import { RefundCreditNote } from '../models/RefundCreditNote';
import { Ledger } from '@/modules/Ledger/Ledger';
import { Knex } from 'knex';
import { TenantModelProxy } from '@/modules/System/models/TenantBaseModel';
import { Account } from '@/modules/Accounts/models/Account.model';
import { ILedgerEntry } from '@/modules/Ledger/types/Ledger.types';
import { AccountNormal } from '@/interfaces/Account';
import { AccountingBasis } from '@/common/types/AccountingBasis';
import { AccountRepository } from '@/modules/Accounts/repositories/Account.repository';
import { RefundCreditNoteCashGL } from './RefundCreditNoteCashGL';

@Injectable()
export class RefundCreditNoteGLEntries {
  constructor(
    private readonly ledgerStorage: LedgerStorageService,
    private readonly accountRepository: AccountRepository,

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

      basis: AccountingBasis.Accrual,
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
   * Retrieves the refund credit note general ledger.
   * The ledger contains both the accrual basis entries (A/R/payment) and
   * the cash basis entries (withdrawal/income) flagged by the basis.
   * @param {RefundCreditNote} refundCreditNote - Refund credit note.
   * @param {number} ARAccountId - A/R account id.
   * @param {Knex.Transaction} trx - Knex transaction.
   * @returns {Promise<Ledger>}
   */
  public getRefundCreditNoteGLedger = async (
    refundCreditNote: RefundCreditNote,
    ARAccountId: number,
    trx?: Knex.Transaction,
  ): Promise<Ledger> => {
    // Accrual basis ledger entries.
    const accrualLedger = new Ledger(
      this.getRefundCreditGLEntries(refundCreditNote, ARAccountId),
    );

    // Find or create the discount account.
    const discountAccount =
      await this.accountRepository.findOrCreateDiscountAccount({}, trx);
    // Find or create the other charges (adjustment) account.
    const adjustmentAccount =
      await this.accountRepository.findOrCreateOtherChargesAccount({}, trx);

    const refundCreditNoteCashGL = new RefundCreditNoteCashGL(refundCreditNote)
      .setDiscountAccountId(discountAccount.id)
      .setAdjustmentAccountId(adjustmentAccount.id);

    // Cash basis ledger entries.
    const cashLedger = refundCreditNoteCashGL.getLedger();

    return new Ledger([
      ...accrualLedger.getEntries(),
      ...cashLedger.getEntries(),
    ]);
  };

  /**
   * Creates refund credit GL entries.
   * @param {IRefundCreditNote} refundCreditNote
   * @param {Knex.Transaction} trx
   */
  public createRefundCreditGLEntries = async (
    refundCreditNoteId: number,
    trx?: Knex.Transaction,
  ) => {
    // Retrieve the refund with associated credit note and items.
    const refundCreditNote = await this.refundCreditNoteModel()
      .query(trx)
      .findById(refundCreditNoteId)
      .withGraphFetched('creditNote.entries.item');

    // Receivable account A/R.
    const receivableAccount = await this.accountModel()
      .query()
      .findOne('slug', 'accounts-receivable');

    // Retrieve refund credit ledger entries.
    const ledger = await this.getRefundCreditNoteGLedger(
      refundCreditNote,
      receivableAccount.id,
      trx,
    );

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
