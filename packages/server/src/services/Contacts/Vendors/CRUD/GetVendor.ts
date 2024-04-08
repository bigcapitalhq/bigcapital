import { TransformerInjectable } from '@/lib/Transformer/TransformerInjectable';
import HasTenancyService from '@/services/Tenancy/TenancyService';
import { Inject, Service } from 'typedi';
import VendorTransfromer from '../VendorTransformer';

@Service()
export class GetVendor {
  @Inject()
  private tenancy: HasTenancyService;

  @Inject()
  private transformer: TransformerInjectable;

  /**
   * Retrieve the given vendor details.
   * @param {number} tenantId
   * @param {number} vendorId
   */
  public async getVendor(tenantId: number, vendorId: number) {
    const { Contact } = this.tenancy.models(tenantId);

    const vendor = await Contact.query().findById(vendorId).modify('vendor').throwIfNotFound();

    // Transformes the vendor.
    return this.transformer.transform(tenantId, vendor, new VendorTransfromer());
  }
}
