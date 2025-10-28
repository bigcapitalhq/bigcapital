import { Injectable } from '@nestjs/common';
import { ServiceError } from '@/modules/Items/ServiceError';
import { ERRORS } from '../constants';

@Injectable()
export class VendorValidators {
  /**
   * Validates the given vendor is not already activated.
   * @param {IVendor} vendor
   */
  public validateNotAlreadyPublished = (vendor) => {
    if (vendor.active) {
      throw new ServiceError(ERRORS.VENDOR_ALREADY_ACTIVE);
    }
  };
}
