import { ISaleInvoice } from '@/interfaces';
import { TransformerInjectable } from '@/lib/Transformer/TransformerInjectable';
import HasTenancyService from '@/services/Tenancy/TenancyService';
import { Inject, Service } from 'typedi';
import { CommandSaleInvoiceValidators } from './CommandSaleInvoiceValidators';
import { SaleInvoiceTransformer } from './SaleInvoiceTransformer';

@Service()
export class GetSaleInvoice {
  @Inject()
  private tenancy: HasTenancyService;

  @Inject()
  private transformer: TransformerInjectable;

  @Inject()
  private validators: CommandSaleInvoiceValidators;

  /**
   * Retrieve sale invoice with associated entries.
   * @param {Number} saleInvoiceId -
   * @param {ISystemUser} authorizedUser -
   * @return {Promise<ISaleInvoice>}
   */
  public async getSaleInvoice(tenantId: number, saleInvoiceId: number): Promise<ISaleInvoice> {
    const { SaleInvoice } = this.tenancy.models(tenantId);

    const saleInvoice = await SaleInvoice.query()
      .findById(saleInvoiceId)
      .withGraphFetched('entries.item')
      .withGraphFetched('entries.tax')
      .withGraphFetched('customer')
      .withGraphFetched('branch')
      .withGraphFetched('taxes.taxRate');

    // Validates the given sale invoice existance.
    this.validators.validateInvoiceExistance(saleInvoice);

    return this.transformer.transform(tenantId, saleInvoice, new SaleInvoiceTransformer());
  }
}
