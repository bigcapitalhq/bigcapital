import { Service, Inject } from 'typedi';
import HasTenancyService from '@/services/Tenancy/TenancyService';
import { InvoicePaymentTransactionTransformer } from './InvoicePaymentTransactionTransformer';
import { TransformerInjectable } from '@/lib/Transformer/TransformerInjectable';

@Service()
export default class InvoicePaymentsService {
  @Inject()
  private tenancy: HasTenancyService;

  @Inject()
  private transformer: TransformerInjectable;

  /**
   * Retrieve the invoice associated payments transactions.
   * @param {number} tenantId - Tenant id.
   * @param {number} invoiceId - Invoice id.
   */
  public getInvoicePayments = async (tenantId: number, invoiceId: number) => {
    const { PaymentReceiveEntry } = this.tenancy.models(tenantId);

    const paymentsEntries = await PaymentReceiveEntry.query()
      .where('invoiceId', invoiceId)
      .withGraphJoined('payment.depositAccount')
      .withGraphJoined('invoice')
      .orderBy('payment:paymentDate', 'ASC');

    return this.transformer.transform(
      tenantId,
      paymentsEntries,
      new InvoicePaymentTransactionTransformer()
    );
  };
}
