import { Inject, Injectable } from '@nestjs/common';
import { TransformerInjectable } from '@/modules/Transformer/TransformerInjectable.service';
import { Vendor } from '../models/Vendor';
import { VendorTransfromer } from './VendorTransformer';

@Injectable()
export class GetVendorService {
  constructor(
    private readonly transformer: TransformerInjectable,
    @Inject(Vendor.name) private readonly vendorModel: typeof Vendor,
  ) {}

  /**
   * Retrieve the given vendor details.
   * @param {number} vendorId
   */
  public async getVendor(vendorId: number) {
    const vendor = await this.vendorModel
      .query()
      .findById(vendorId)
      .throwIfNotFound();

    // Transformes the vendor.
    return this.transformer.transform(vendor, new VendorTransfromer());
  }
}
