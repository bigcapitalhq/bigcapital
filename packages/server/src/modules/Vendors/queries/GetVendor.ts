import { Inject, Injectable } from '@nestjs/common';
import { TransformerInjectable } from '@/modules/Transformer/TransformerInjectable.service';
import { Vendor } from '../models/Vendor';
import { VendorTransfromer } from './VendorTransformer';
import { TenantModelProxy } from '@/modules/System/models/TenantBaseModel';
import { CustomFieldValuesService } from '@/modules/CustomFields/CustomFieldValues.service';

@Injectable()
export class GetVendorService {
  constructor(
    private readonly transformer: TransformerInjectable,
    private readonly customFieldValuesService: CustomFieldValuesService,
    @Inject(Vendor.name)
    private readonly vendorModel: TenantModelProxy<typeof Vendor>,
  ) {}

  /**
   * Retrieve the given vendor details.
   * @param {number} vendorId
   */
  public async getVendor(vendorId: number) {
    const vendor = await this.vendorModel()
      .query()
      .findById(vendorId)
      .throwIfNotFound();

    // Transformes the vendor.
    const customFields = await this.customFieldValuesService.getValues(
      'Vendor',
      vendorId,
    );
    return this.transformer.transform(vendor, new VendorTransfromer(), {
      customFields,
    });
  }
}
