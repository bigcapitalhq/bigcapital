import { ISaleInvoice } from '@/interfaces';
import { TransformerInjectable } from '@/lib/Transformer/TransformerInjectable';
import { Inject, Service } from 'typedi';
import { CreditNoteWithInvoicesToApplyTransformer } from './CreditNoteWithInvoicesToApplyTransformer';
import BaseCreditNotes from './CreditNotes';

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
    creditNoteId: number,
  ): Promise<ISaleInvoice[]> => {
    const { SaleInvoice } = this.tenancy.models(tenantId);

    // Retireve credit note or throw not found service error.
    const creditNote = await this.getCreditNoteOrThrowError(tenantId, creditNoteId);
    // Retrieves the published due invoices that associated to the given customer.
    const saleInvoices = await SaleInvoice.query()
      .where('customerId', creditNote.customerId)
      .modify('dueInvoices')
      .modify('published');

    // Transformes the sale invoices models to POJO.
    return this.transformer.transform(tenantId, saleInvoices, new CreditNoteWithInvoicesToApplyTransformer());
  };
}
