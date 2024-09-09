import { Inject, Service } from 'typedi';
import { GetSaleInvoice } from '../Sales/Invoices/GetSaleInvoice';
import { CreatePaymentReceived } from '../Sales/PaymentReceived/CreatePaymentReceived';

@Service()
export class CreatePaymentReceiveStripePayment {
  @Inject()
  private getSaleInvoiceService: GetSaleInvoice;

  @Inject()
  private createPaymentReceivedService: CreatePaymentReceived;

  /**
   * 
   * @param {number} tenantId 
   * @param {number} saleInvoiceId 
   * @param {number} paidAmount 
   */
  async createPaymentReceived(
    tenantId: number,
    saleInvoiceId: number,
    paidAmount: number
  ) {
    const invoice = await this.getSaleInvoiceService.getSaleInvoice(
      tenantId,
      saleInvoiceId
    );
    await this.createPaymentReceivedService.createPaymentReceived(tenantId, {
      customerId: invoice.customerId,
      paymentDate: new Date(),
      amount: paidAmount,
      depositAccountId: 1002,
      statement: '',
      entries: [{ invoiceId: saleInvoiceId, paymentAmount: paidAmount }],
    });
  }
}
