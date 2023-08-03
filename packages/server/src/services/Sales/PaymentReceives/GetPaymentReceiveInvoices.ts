import HasTenancyService from '@/services/Tenancy/TenancyService';
import { Inject, Service } from 'typedi';

@Service()
export class GetPaymentReceiveInvoices {
  @Inject()
  private tenancy: HasTenancyService;

  /**
   * Retrieve sale invoices that assocaited to the given payment receive.
   * @param {number} tenantId - Tenant id.
   * @param {number} paymentReceiveId - Payment receive id.
   * @return {Promise<ISaleInvoice>}
   */
  public async getPaymentReceiveInvoices(
    tenantId: number,
    paymentReceiveId: number
  ) {
    const { SaleInvoice } = this.tenancy.models(tenantId);

    const paymentReceive = await this.getPaymentReceiveOrThrowError(
      tenantId,
      paymentReceiveId
    );
    const paymentReceiveInvoicesIds = paymentReceive.entries.map(
      (entry) => entry.invoiceId
    );
    const saleInvoices = await SaleInvoice.query().whereIn(
      'id',
      paymentReceiveInvoicesIds
    );
    return saleInvoices;
  }
}
