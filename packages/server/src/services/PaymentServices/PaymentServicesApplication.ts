import { Service, Inject } from 'typedi';
import { GetPaymentServicesSpecificInvoice } from './GetPaymentServicesSpecificInvoice';

@Service()
export class PaymentServicesApplication {
  @Inject()
  private getPaymentServicesSpecificInvoice: GetPaymentServicesSpecificInvoice;

  /**
   * Retrieves the payment services for a specific invoice.
   * @param {number} tenantId - The ID of the tenant.
   * @param {number} invoiceId - The ID of the invoice.
   * @returns {Promise<any>} The payment services for the specified invoice.
   */
  async getPaymentServicesForInvoice(tenantId: number): Promise<any> {
    return this.getPaymentServicesSpecificInvoice.getPaymentServicesInvoice(
      tenantId
    );
  }
}
