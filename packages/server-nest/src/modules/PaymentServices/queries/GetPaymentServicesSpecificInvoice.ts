import { Inject, Service } from 'typedi';
import HasTenancyService from '../Tenancy/TenancyService';
import { TransformerInjectable } from '@/lib/Transformer/TransformerInjectable';
import { GetPaymentServicesSpecificInvoiceTransformer } from './GetPaymentServicesSpecificInvoiceTransformer';

@Service()
export class GetPaymentServicesSpecificInvoice {
  @Inject()
  private tenancy: HasTenancyService;

  @Inject()
  private transform: TransformerInjectable;

  /**
   * Retrieves the payment services of the given invoice.
   * @param {number} tenantId
   * @param {number} invoiceId
   * @returns
   */
  async getPaymentServicesInvoice(tenantId: number) {
    const { PaymentIntegration } = this.tenancy.models(tenantId);

    const paymentGateways = await PaymentIntegration.query()
      .modify('fullEnabled')
      .orderBy('name', 'ASC');

    return this.transform.transform(
      tenantId,
      paymentGateways,
      new GetPaymentServicesSpecificInvoiceTransformer()
    );
  }
}
