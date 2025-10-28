import { Inject, Injectable } from '@nestjs/common';
import { TransformerInjectable } from '@/modules/Transformer/TransformerInjectable.service';
import { GetPaymentServicesSpecificInvoiceTransformer } from './GetPaymentServicesSpecificInvoiceTransformer';
import { PaymentIntegration } from '../models/PaymentIntegration.model';
import { TenantModelProxy } from '@/modules/System/models/TenantBaseModel';

@Injectable()
export class GetPaymentServicesSpecificInvoice {
  constructor(
    private readonly transform: TransformerInjectable,

    @Inject(PaymentIntegration.name)
    private readonly paymentIntegrationModel: TenantModelProxy<
      typeof PaymentIntegration
    >,
  ) {}

  /**
   * Retrieves the payment services of the given invoice.
   * @param {number} invoiceId
   * @returns
   */
  async getPaymentServicesInvoice() {
    const paymentGateways = await this.paymentIntegrationModel()
      .query()
      .modify('fullEnabled')
      .orderBy('name', 'ASC');

    return this.transform.transform(
      paymentGateways,
      new GetPaymentServicesSpecificInvoiceTransformer(),
    );
  }
}
