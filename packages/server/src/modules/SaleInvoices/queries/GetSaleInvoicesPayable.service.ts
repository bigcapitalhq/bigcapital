import { Injectable, Inject } from '@nestjs/common';
import { SaleInvoice } from '../models/SaleInvoice';
import { TenantModelProxy } from '@/modules/System/models/TenantBaseModel';

@Injectable()
export class GetSaleInvoicesPayable {
  constructor(
    @Inject(SaleInvoice.name)
    private readonly saleInvoiceModel: TenantModelProxy<typeof SaleInvoice>,
  ) {}

  /**
   * Retrieve due sales invoices.
   * @param {number} customerId - Customer id.
   */
  public async getPayableInvoices(
    customerId?: number,
  ): Promise<Array<SaleInvoice>> {
    const salesInvoices = await this.saleInvoiceModel()
      .query()
      .onBuild((query) => {
        query.modify('dueInvoices');
        query.modify('delivered');

        if (customerId) {
          query.where('customer_id', customerId);
        }
      });
    return salesInvoices;
  }
}
