import { Inject, Service } from 'typedi';
import HasTenancyService from '@/services/Tenancy/TenancyService';
import { PaymentReceivedValidators } from './PaymentReceivedValidators';

@Service()
export class GetPaymentReceivedInvoices {
  @Inject()
  private tenancy: HasTenancyService;

  @Inject()
  private validators: PaymentReceivedValidators;

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
    const { SaleInvoice, PaymentReceive } = this.tenancy.models(tenantId);

    const paymentReceive = await PaymentReceive.query()
      .findById(paymentReceiveId)
      .withGraphFetched('entries');

    // Validates the payment receive existance.
    this.validators.validatePaymentExistance(paymentReceive);

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
