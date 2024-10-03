import { Inject, Service } from 'typedi';
import { IPaymentReceivedState } from '@/interfaces';
import HasTenancyService from '@/services/Tenancy/TenancyService';

@Service()
export class GetPaymentReceivedState {
  @Inject()
  private tenancy: HasTenancyService;

  /**
   * Retrieves the create/edit initial state of the payment received.
   * @param {number} tenantId - The ID of the tenant.
   * @returns {Promise<IPaymentReceivedState>} - A promise resolving to the payment received state.
   */
  public async getPaymentReceivedState(
    tenantId: number
  ): Promise<IPaymentReceivedState> {
    const { PdfTemplate } = this.tenancy.models(tenantId);

    const defaultPdfTemplate = await PdfTemplate.query()
      .findOne({ resource: 'PaymentReceive' })
      .modify('default');

    return {
      defaultTemplateId: defaultPdfTemplate?.id,
    };
  }
}
