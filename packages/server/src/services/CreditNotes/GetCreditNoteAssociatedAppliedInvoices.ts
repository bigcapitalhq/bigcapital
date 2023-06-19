import { Inject, Service } from 'typedi';
import { ISaleInvoice } from '@/interfaces';
import BaseCreditNotes from './CreditNotes';
import { CreditNoteAppliedInvoiceTransformer } from './CreditNoteAppliedInvoiceTransformer';
import { TransformerInjectable } from '@/lib/Transformer/TransformerInjectable';

@Service()
export default class GetCreditNoteAssociatedAppliedInvoices extends BaseCreditNotes {
  @Inject()
  private transformer: TransformerInjectable;

  /**
   * Retrieve credit note associated invoices to apply.
   * @param {number} tenantId
   * @param {number} creditNoteId
   * @returns {Promise<ISaleInvoice[]>}
   */
  public getCreditAssociatedAppliedInvoices = async (
    tenantId: number,
    creditNoteId: number
  ): Promise<ISaleInvoice[]> => {
    const { CreditNoteAppliedInvoice } = this.tenancy.models(tenantId);

    // Retrieve credit note or throw not found service error.
    const creditNote = await this.getCreditNoteOrThrowError(
      tenantId,
      creditNoteId
    );
    const appliedToInvoices = await CreditNoteAppliedInvoice.query()
      .where('credit_note_id', creditNoteId)
      .withGraphFetched('saleInvoice')
      .withGraphFetched('creditNote');

    // Transformes credit note applied to invoices.
    return this.transformer.transform(
      tenantId,
      appliedToInvoices,
      new CreditNoteAppliedInvoiceTransformer()
    );
  };
}
