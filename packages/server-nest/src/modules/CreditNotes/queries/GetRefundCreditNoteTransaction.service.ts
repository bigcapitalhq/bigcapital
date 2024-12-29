import { Inject, Injectable } from '@nestjs/common';
import { IRefundCreditNote } from '../types/CreditNotes.types';
import { RefundCreditNote } from '../models/RefundCreditNote';
import { RefundCreditNoteTransformer } from './RefundCreditNoteTransformer';

@Injectable()
export class GetRefundCreditNoteTransaction {
  /**
   * @param {RefundCreditNoteTransformer} transformer
   * @param {typeof RefundCreditNote} refundCreditNoteModel
   */
  constructor(
    private readonly transformer: RefundCreditNoteTransformer,

    @Inject(RefundCreditNote.name)
    private readonly refundCreditNoteModel: typeof RefundCreditNote,
  ) {
  }

  /**
   * Retrieve credit note associated invoices to apply.
   * @param {number} refundCreditId
   * @returns {Promise<IRefundCreditNote>}
   */
  public async getRefundCreditTransaction(
    refundCreditId: number
  ): Promise<IRefundCreditNote> {
    const refundCreditNote = await this.refundCreditNoteModel
      .query()
      .findById(refundCreditId)
      .withGraphFetched('fromAccount')
      .withGraphFetched('creditNote')
      .throwIfNotFound();

    return this.transformer.transform(refundCreditNote);
  }
}
