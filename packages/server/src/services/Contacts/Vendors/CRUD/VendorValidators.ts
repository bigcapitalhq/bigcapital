import { ServiceError } from '@/exceptions';
import { Service, Inject } from 'typedi';
import { ERRORS } from '../constants';

@Service()
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
