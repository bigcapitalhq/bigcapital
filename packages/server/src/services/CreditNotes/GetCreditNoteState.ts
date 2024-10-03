import { Inject, Service } from 'typedi';
import { ICreditNoteState } from '@/interfaces';
import HasTenancyService from '../Tenancy/TenancyService';

@Service()
export class GetCreditNoteState {
  @Inject()
  private tenancy: HasTenancyService;

  /**
   * Retrieves the create/edit initial state of the payment received.
   * @param {Number} saleInvoiceId -
   * @return {Promise<ISaleInvoice>}
   */
  public async getCreditNoteState(tenantId: number): Promise<ICreditNoteState> {
    const { PdfTemplate } = this.tenancy.models(tenantId);

    const defaultPdfTemplate = await PdfTemplate.query()
      .findOne({ resource: 'CreditNote' })
      .modify('default');

    return {
      defaultTemplateId: defaultPdfTemplate?.id,
    };
  }
}
