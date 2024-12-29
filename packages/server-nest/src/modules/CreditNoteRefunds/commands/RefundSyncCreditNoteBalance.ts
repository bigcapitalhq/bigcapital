import { Knex } from 'knex';
import { Inject, Injectable } from '@nestjs/common';
import { CreditNote } from '@/modules/CreditNotes/models/CreditNote';

@Injectable()
export class RefundSyncCreditNoteBalanceService {
  /**
   * @param {typeof CreditNote} creditNoteModel - The credit note model.
   */
  constructor(
    @Inject(CreditNote.name)
    private readonly creditNoteModel: typeof CreditNote,
  ) {}

  /**
   * Increments the refund amount of the credit note.
   * @param {number} creditNoteId - The credit note ID.
   * @param {number} amount - The amount to increment.
   * @param {Knex.Transaction} trx - The knex transaction.
   */
  public incrementCreditNoteRefundAmount = async (
    creditNoteId: number,
    amount: number,
    trx?: Knex.Transaction
  ): Promise<void> => {
    await this.creditNoteModel
      .query(trx)
      .findById(creditNoteId)
      .increment('refunded_amount', amount);
  };

  /**
   * Decrements the refund amount of the credit note.
   * @param {number} creditNoteId - The credit note ID.
   * @param {number} amount - The amount to decrement.
   * @param {Knex.Transaction} trx - The knex transaction.
   */
  public decrementCreditNoteRefundAmount = async (
    creditNoteId: number,
    amount: number,
    trx?: Knex.Transaction
  ): Promise<void> => {
    await this.creditNoteModel
      .query(trx)
      .findById(creditNoteId)
      .decrement('refunded_amount', amount);
  };
}
