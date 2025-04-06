import { ERRORS } from '../constants';
import { Injectable } from '@nestjs/common';
import { Customer } from '../models/Customer';
import { ServiceError } from '@/modules/Items/ServiceError';

@Injectable()
export class CustomerValidators {
  /**
   * Validates the given customer is not already published.
   * @param {ICustomer} customer
   */
  public validateNotAlreadyPublished = (customer: Customer) => {
    if (customer.active) {
      throw new ServiceError(ERRORS.CUSTOMER_ALREADY_ACTIVE);
    }
  };
}
