import { Service, Inject } from 'typedi';
import BaseCreditNotes from './CreditNotes';
import { ISaleInvoice } from '@/interfaces';
import { CreditNoteWithInvoicesToApplyTransformer } from './CreditNoteWithInvoicesToApplyTransformer';
import { TransformerInjectable } from '@/lib/Transformer/TransformerInjectable';

@Service()
export default class GetCreditNoteAssociatedInvoicesToApply extends BaseCreditNotes {
  @Inject()
  private transformer: TransformerInjectable;

  /**
   * Retrieve credit note associated invoices to apply.
   * @param {number} tenantId
   * @param {number} creditNoteId
   * @returns {Promise<ISaleInvoice[]>}
   */
  public getCreditAssociatedInvoicesToApply = async (
    tenantId: number,
    creditNoteId: number
  ): Promise<ISaleInvoice[]> => {
    const { SaleInvoice } = this.tenancy.models(tenantId);

    // Retrieve credit note or throw not found service error.
    const creditNote = await this.getCreditNoteOrThrowError(
      tenantId,
      creditNoteId
    );
    // Retrieves the published due invoices that associated to the given customer.
    const saleInvoices = await SaleInvoice.query()
      .where('customerId', creditNote.customerId)
      .modify('dueInvoices')
      .modify('published');

    // Transforms the sale invoices models to POJO.
    return this.transformer.transform(
      tenantId,
      saleInvoices,
      new CreditNoteWithInvoicesToApplyTransformer()
    );
  };
}
