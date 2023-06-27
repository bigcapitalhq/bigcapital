import { IRefundCreditNotePOJO } from '@/interfaces';
import { TransformerInjectable } from '@/lib/Transformer/TransformerInjectable';
import HasTenancyService from '@/services/Tenancy/TenancyService';
import { Inject, Service } from 'typedi';
import BaseCreditNotes from './CreditNotes';
import RefundCreditNoteTransformer from './RefundCreditNoteTransformer';

@Service()
export default class ListCreditNoteRefunds extends BaseCreditNotes {
  @Inject()
  private tenancy: HasTenancyService;

  @Inject()
  private transformer: TransformerInjectable;

  /**
   * Retrieve the credit note graph.
   * @param {number} tenantId
   * @param {number} creditNoteId
   * @returns {Promise<IRefundCreditNotePOJO[]>}
   */
  public getCreditNoteRefunds = async (
    tenantId: number,
    creditNoteId: number
  ): Promise<IRefundCreditNotePOJO[]> => {
    const { RefundCreditNote } = this.tenancy.models(tenantId);

    // Retrieve refund credit notes associated to the given credit note.
    const refundCreditTransactions = await RefundCreditNote.query()
      .where('creditNoteId', creditNoteId)
      .withGraphFetched('creditNote')
      .withGraphFetched('fromAccount');

    // Transforms refund credit note models to POJO objects.
    return this.transformer.transform(
      tenantId,
      refundCreditTransactions,
      new RefundCreditNoteTransformer()
    );
  };
}
