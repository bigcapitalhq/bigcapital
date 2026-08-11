import { Inject, Injectable } from '@nestjs/common';
import { ServiceError } from '@/modules/Items/ServiceError';
import { ERRORS } from '../constants';
import { Vendor } from '../models/Vendor';
import { TenantModelProxy } from '@/modules/System/models/TenantBaseModel';

@Injectable()
export class VendorValidators {
  constructor(
    @Inject(Vendor.name)
    private readonly vendorModel: TenantModelProxy<typeof Vendor>,
  ) {}

  /**
   * Validates the given vendor is not already activated.
   * @param {IVendor} vendor
   */
  public validateNotAlreadyPublished = (vendor) => {
    if (vendor.active) {
      throw new ServiceError(ERRORS.VENDOR_ALREADY_ACTIVE);
    }
  };

  /**
   * Validates the given code is unique among vendors.
   * @param {string | null | undefined} code
   * @param {number} [exceptVendorId] - Vendor id to exclude (on edit).
   */
  public validateVendorCodeUnique = async (
    code: string | null | undefined,
    exceptVendorId?: number,
  ) => {
    if (!code) {
      return;
    }
    const vendor = await this.vendorModel()
      .query()
      .onBuild((query) => {
        query.select(['id']);
        query.where('code', code);

        if (exceptVendorId) {
          query.whereNot('id', exceptVendorId);
        }
      })
      .first();

    if (vendor) {
      throw new ServiceError(ERRORS.VENDOR_CODE_NOT_UNIQUE);
    }
  };
}
