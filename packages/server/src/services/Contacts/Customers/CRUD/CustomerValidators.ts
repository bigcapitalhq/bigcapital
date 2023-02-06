import { ServiceError } from '@/exceptions';
import { Service, Inject } from 'typedi';
import { ERRORS } from '../constants';

@Service()
export class CustomerValidators {
  /**
   * Validates the given customer is not already published.
   * @param {ICustomer} customer
   */
  public validateNotAlreadyPublished = (customer) => {
    if (customer.active) {
      throw new ServiceError(ERRORS.CUSTOMER_ALREADY_ACTIVE);
    }
  };
}
