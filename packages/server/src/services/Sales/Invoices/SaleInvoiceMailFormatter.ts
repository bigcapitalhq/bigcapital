import HasTenancyService from '@/services/Tenancy/TenancyService';
import { GetSaleInvoice } from './GetSaleInvoice';
import { Inject, Service } from 'typedi';
import { Tenant } from '@/system/models';

@Service()
export class SaleInvoiceMailFormatter {
  @Inject()
  private tenancy: HasTenancyService;

  @Inject()
  private getSaleInvoiceService: GetSaleInvoice;

  /**
   * Retrieves the formatted text of the given sale invoice.
   * @param {number} tenantId - Tenant id.
   * @param {number} invoiceId - Sale invoice id.
   * @param {string} text - The given text.
   * @returns {Promise<string>}
   */
  public formatText = async (
    tenantId: number,
    invoiceId: number,
    text: string
  ): Promise<string> => {
    const invoice = await this.getSaleInvoiceService.getSaleInvoice(
      tenantId,
      invoiceId
    );
    const organization = await Tenant.query()
      .findById(tenantId)
      .withGraphFetched('metadata');

    return text
      .replace('{CompanyName}', organization.metadata.name)
      .replace('{CustomerName}', invoice.customer.displayName)
      .replace('{InvoiceNumber}', invoice.invoiceNo)
      .replace('{InvoiceDueAmount}', invoice.dueAmountFormatted)
      .replace('{InvoiceDueDate}', invoice.dueDateFormatted)
      .replace('{InvoiceDate}', invoice.invoiceDateFormatted)
      .replace('{InvoiceAmount}', invoice.totalFormatted);
  };
}
