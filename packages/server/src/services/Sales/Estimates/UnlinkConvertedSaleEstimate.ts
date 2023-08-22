import { Knex } from 'knex';
import { Inject, Service } from 'typedi';
import HasTenancyService from '@/services/Tenancy/TenancyService';

@Service()
export class UnlinkConvertedSaleEstimate {
  @Inject()
  private tenancy: HasTenancyService;

  /**
   * Unlink the converted sale estimates from the given sale invoice.
   * @param {number} tenantId -
   * @param {number} invoiceId -
   * @return {Promise<void>}
   */
  public async unlinkConvertedEstimateFromInvoice(
    tenantId: number,
    invoiceId: number,
    trx?: Knex.Transaction
  ): Promise<void> {
    const { SaleEstimate } = this.tenancy.models(tenantId);

    await SaleEstimate.query(trx)
      .where({
        convertedToInvoiceId: invoiceId,
      })
      .patch({
        convertedToInvoiceId: null,
        convertedToInvoiceAt: null,
      });
  }
}
