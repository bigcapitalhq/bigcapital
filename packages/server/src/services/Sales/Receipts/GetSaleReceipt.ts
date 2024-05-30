import { Inject, Service } from 'typedi';
import { SaleReceiptTransformer } from './SaleReceiptTransformer';
import HasTenancyService from '@/services/Tenancy/TenancyService';
import { TransformerInjectable } from '@/lib/Transformer/TransformerInjectable';
import { SaleReceiptValidators } from './SaleReceiptValidators';

@Service()
export class GetSaleReceipt {
  @Inject()
  private tenancy: HasTenancyService;

  @Inject()
  private transformer: TransformerInjectable;

  @Inject()
  private validators: SaleReceiptValidators;

  /**
   * Retrieve sale receipt with associated entries.
   * @param {Integer} saleReceiptId
   * @return {ISaleReceipt}
   */
  public async getSaleReceipt(tenantId: number, saleReceiptId: number) {
    const { SaleReceipt } = this.tenancy.models(tenantId);

    const saleReceipt = await SaleReceipt.query()
      .findById(saleReceiptId)
      .withGraphFetched('entries.item')
      .withGraphFetched('customer')
      .withGraphFetched('depositAccount')
      .withGraphFetched('branch')
      .withGraphFetched('attachments');

    // Valdiates the sale receipt existance.
    this.validators.validateReceiptExistance(saleReceipt);

    return this.transformer.transform(
      tenantId,
      saleReceipt,
      new SaleReceiptTransformer()
    );
  }
}
