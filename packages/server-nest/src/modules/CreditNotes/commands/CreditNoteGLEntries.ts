import { Knex } from 'knex';
import { CreditNoteGL } from './CreditNoteGL';
import { Inject, Injectable } from '@nestjs/common';
import { LedgerStorageService } from '@/modules/Ledger/LedgerStorage.service';
import { CreditNote } from '../models/CreditNote';
import { AccountRepository } from '@/modules/Accounts/repositories/Account.repository';

@Injectable()
export class CreditNoteGLEntries {
  constructor(
    private readonly ledgerStorage: LedgerStorageService,
    private readonly accountRepository: AccountRepository,

    @Inject(CreditNote.name)
    private readonly creditNoteModel: typeof CreditNote,
  ) {}

  /**
   * Reverts the credit note associated GL entries.
   * @param {number} creditNoteId - Credit note id.
   * @param {Knex.Transaction} trx
   */
  public revertVendorCreditGLEntries = async (
    creditNoteId: number,
    trx?: Knex.Transaction,
  ): Promise<void> => {
    await this.ledgerStorage.deleteByReference(creditNoteId, 'CreditNote', trx);
  };

  /**
   * Writes vendor credit associated GL entries.
   * @param {number} creditNoteId - Credit note id.
   * @param {Knex.Transaction} trx - Knex transactions.
   */
  public createVendorCreditGLEntries = async (
    creditNoteId: number,
    trx?: Knex.Transaction,
  ): Promise<void> => {
    // Retrieve the credit note with associated entries and items.
    const creditNoteWithItems = await CreditNote.query(trx)
      .findById(creditNoteId)
      .withGraphFetched('entries.item');

    // Retreive the the `accounts receivable` account based on the given currency.
    const ARAccount =
      await this.accountRepository.findOrCreateAccountReceivable(
        creditNoteWithItems.currencyCode,
      );
    const discountAccount =
      await this.accountRepository.findOrCreateDiscountAccount({});

    const adjustmentAccount =
      await this.accountRepository.findOrCreateOtherChargesAccount({});

    const creditNoteLedger = new CreditNoteGL(creditNoteWithItems)
      .setARAccountId(ARAccount.id)
      .setDiscountAccountId(discountAccount.id)
      .setAdjustmentAccountId(adjustmentAccount.id)
      .getCreditNoteLedger();

    // Saves the credit note GL entries.
    await this.ledgerStorage.commit(creditNoteLedger, trx);
  };

  /**
   * Edits vendor credit associated GL entries.
   * @param {number} creditNoteId - Credit note id.
   * @param {Knex.Transaction} trx
   */
  public editVendorCreditGLEntries = async (
    creditNoteId: number,
    trx?: Knex.Transaction,
  ): Promise<void> => {
    // Reverts vendor credit GL entries.
    await this.revertVendorCreditGLEntries(creditNoteId, trx);

    // Creates vendor credit Gl entries.
    await this.createVendorCreditGLEntries(creditNoteId, trx);
  };
}
