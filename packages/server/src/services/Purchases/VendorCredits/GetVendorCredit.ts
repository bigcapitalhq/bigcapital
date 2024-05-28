import { ServiceError } from '@/exceptions';
import { TransformerInjectable } from '@/lib/Transformer/TransformerInjectable';
import HasTenancyService from '@/services/Tenancy/TenancyService';
import { VendorCreditTransformer } from './VendorCreditTransformer';
import { Inject, Service } from 'typedi';
import { ERRORS } from './constants';

@Service()
export default class GetVendorCredit {
  @Inject()
  private tenancy: HasTenancyService;

  @Inject()
  private transformer: TransformerInjectable;

  /**
   * Retrieve the given vendor credit.
   * @param {number} tenantId - Tenant id.
   * @param {number} vendorCreditId - Vendor credit id.
   */
  public getVendorCredit = async (tenantId: number, vendorCreditId: number) => {
    const { VendorCredit } = this.tenancy.models(tenantId);

    // Retrieve the vendor credit model graph.
    const vendorCredit = await VendorCredit.query()
      .findById(vendorCreditId)
      .withGraphFetched('entries.item')
      .withGraphFetched('vendor')
      .withGraphFetched('branch')
      .withGraphFetched('attachments');

    if (!vendorCredit) {
      throw new ServiceError(ERRORS.VENDOR_CREDIT_NOT_FOUND);
    }
    return this.transformer.transform(
      tenantId,
      vendorCredit,
      new VendorCreditTransformer()
    );
  };
}
