import { Inject, Injectable } from '@nestjs/common';
import { TransformerInjectable } from '@/modules/Transformer/TransformerInjectable.service';
import { RefundCreditNote } from '../models/RefundCreditNote';
import { RefundCreditNoteTransformer } from '@/modules/CreditNotes/queries/RefundCreditNoteTransformer';
import { IRefundCreditNotePOJO } from '../types/CreditNoteRefunds.types';

@Injectable()
export class ListCreditNoteRefunds {
  constructor(
    private readonly transformer: TransformerInjectable,

    @Inject(RefundCreditNote.name)
    private readonly refundCreditNoteModel: typeof RefundCreditNote,
  ) {}

  /**
   * Retrieve the credit note graph.
   * @param {number} creditNoteId
   * @returns {Promise<IRefundCreditNotePOJO[]>}
   */
  public async getCreditNoteRefunds(
    creditNoteId: number,
  ): Promise<IRefundCreditNotePOJO[]> {
    // Retrieve refund credit notes associated to the given credit note.
    const refundCreditTransactions = await this.refundCreditNoteModel
      .query()
      .where('creditNoteId', creditNoteId)
      .withGraphFetched('creditNote')
      .withGraphFetched('fromAccount');

    // Transforms refund credit note models to POJO objects.
    return this.transformer.transform(
      refundCreditTransactions,
      new RefundCreditNoteTransformer(),
    );
  }
}
