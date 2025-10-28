import { TransformerInjectable } from '@/modules/Transformer/TransformerInjectable.service';
import { InvoicePaymentTransactionTransformer } from './InvoicePaymentTransaction.transformer';
import { Inject, Injectable } from '@nestjs/common';
import { PaymentReceivedEntry } from '@/modules/PaymentReceived/models/PaymentReceivedEntry';
import { TenantModelProxy } from '@/modules/System/models/TenantBaseModel';

@Injectable()
export class GetInvoicePaymentsService {
  constructor(
    private readonly transformer: TransformerInjectable,

    @Inject(PaymentReceivedEntry.name)
    private readonly paymentReceivedEntryModel: TenantModelProxy<
      typeof PaymentReceivedEntry
    >,
  ) {}

  /**
   * Retrieve the invoice associated payments transactions.
   * @param {number} tenantId - Tenant id.
   * @param {number} invoiceId - Invoice id.
   */
  public getInvoicePayments = async (invoiceId: number) => {
    const paymentsEntries = await this.paymentReceivedEntryModel()
      .query()
      .where('invoiceId', invoiceId)
      .withGraphJoined('payment.depositAccount')
      .withGraphJoined('invoice')
      .orderBy('payment:paymentDate', 'ASC');

    return this.transformer.transform(
      paymentsEntries,
      new InvoicePaymentTransactionTransformer(),
    );
  };
}
