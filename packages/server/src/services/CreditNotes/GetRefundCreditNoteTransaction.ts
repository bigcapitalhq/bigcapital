import { Inject, Service } from 'typedi';
import { IRefundCreditNote } from '@/interfaces';
import RefundCreditNote from './RefundCreditNote';
import RefundCreditNoteTransformer from './RefundCreditNoteTransformer';
import { TransformerInjectable } from '@/lib/Transformer/TransformerInjectable';

@Service()
export default class getRefundCreditNoteTransaction extends RefundCreditNote {
  @Inject()
  private transformer: TransformerInjectable;

  /**
   * Retrieve credit note associated invoices to apply.
   * @param {number} tenantId
   * @param {number} creditNoteId
   * @returns {Promise<ISaleInvoice[]>}
   */
  public getRefundCreditTransaction = async (
    tenantId: number,
    refundCreditId: number
  ): Promise<IRefundCreditNote> => {
    const { RefundCreditNote } = this.tenancy.models(tenantId);

    await this.getCreditNoteRefundOrThrowError(tenantId, refundCreditId);

    const refundCreditNote = await RefundCreditNote.query()
      .findById(refundCreditId)
      .withGraphFetched('fromAccount')
      .withGraphFetched('creditNote');

    return this.transformer.transform(
      tenantId,
      refundCreditNote,
      new RefundCreditNoteTransformer()
    );
  };
}
