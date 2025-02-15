import { Inject, Injectable } from '@nestjs/common';
import { Knex } from 'knex';
import { SaleEstimate } from '../models/SaleEstimate';
import { TenantModelProxy } from '@/modules/System/models/TenantBaseModel';

@Injectable()
export class UnlinkConvertedSaleEstimate {
  constructor(
    @Inject(SaleEstimate.name)
    private readonly saleEstimateModel: TenantModelProxy<typeof SaleEstimate>,
  ) {}

  /**
   * Unlink the converted sale estimates from the given sale invoice.
   * @param {number} invoiceId -
   * @return {Promise<void>}
   */
  public async unlinkConvertedEstimateFromInvoice(
    invoiceId: number,
    trx?: Knex.Transaction,
  ): Promise<void> {
    await this.saleEstimateModel()
      .query(trx)
      .where({
        convertedToInvoiceId: invoiceId,
      })
      .patch({
        convertedToInvoiceId: null,
        convertedToInvoiceAt: null,
      });
  }
}
