import { Inject, Service } from 'typedi';
import { ISaleInvoice, ISystemUser } from '@/interfaces';
import { SaleInvoiceTransformer } from './SaleInvoiceTransformer';
import { TransformerInjectable } from '@/lib/Transformer/TransformerInjectable';
import HasTenancyService from '@/services/Tenancy/TenancyService';

@Service()
export class GetSaleInvoice {
  @Inject()
  private tenancy: HasTenancyService;

  @Inject()
  private transformer: TransformerInjectable;

  /**
   * Retrieve sale invoice with associated entries.
   * @param {Number} saleInvoiceId -
   * @param {ISystemUser} authorizedUser -
   * @return {Promise<ISaleInvoice>}
   */
  public async getSaleInvoice(
    tenantId: number,
    saleInvoiceId: number,
    authorizedUser: ISystemUser
  ): Promise<ISaleInvoice> {
    const { SaleInvoice } = this.tenancy.models(tenantId);

    const saleInvoice = await SaleInvoice.query()
      .findById(saleInvoiceId)
      .withGraphFetched('entries.item')
      .withGraphFetched('customer')
      .withGraphFetched('branch');

    return this.transformer.transform(
      tenantId,
      saleInvoice,
      new SaleInvoiceTransformer()
    );
  }
}
