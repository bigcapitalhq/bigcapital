import { Knex } from 'knex';
import { Inject, Injectable } from '@nestjs/common';
import { CreditNote } from '../../CreditNotes/models/CreditNote';

@Injectable()
export class CreditNoteApplySyncCredit {
  constructor(
    @Inject(CreditNote.name)
    private creditNoteModel: typeof CreditNote,
  ) {}

  /**
   * Increment credit note invoiced amount.
   * @param {number} creditNoteId
   * @param {number} invoicesAppliedAmount
   * @param {Knex.Transaction} [trx]
   */
  public async incrementCreditNoteInvoicedAmount(
    creditNoteId: number,
    invoicesAppliedAmount: number,
    trx?: Knex.Transaction,
  ): Promise<void> {
    await this.creditNoteModel
      .query(trx)
      .findById(creditNoteId)
      .increment('invoicesAmount', invoicesAppliedAmount);
  }

  /**
   * Decrement credit note invoiced amount.
   * @param {number} creditNoteId
   * @param {number} invoicesAppliedAmount
   * @param {Knex.Transaction} [trx]
   */
  public async decrementCreditNoteInvoicedAmount(
    creditNoteId: number,
    invoicesAppliedAmount: number,
    trx?: Knex.Transaction,
  ): Promise<void> {
    await this.creditNoteModel
      .query(trx)
      .findById(creditNoteId)
      .decrement('invoicesAmount', invoicesAppliedAmount);
  }
}
