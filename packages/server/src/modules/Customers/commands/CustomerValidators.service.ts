import { ERRORS } from '../constants';
import { Inject, Injectable } from '@nestjs/common';
import { Customer } from '../models/Customer';
import { ServiceError } from '@/modules/Items/ServiceError';
import { TenantModelProxy } from '@/modules/System/models/TenantBaseModel';

@Injectable()
export class CustomerValidators {
  constructor(
    @Inject(Customer.name)
    private readonly customerModel: TenantModelProxy<typeof Customer>,
  ) {}

  /**
   * Validates the given customer is not already published.
   * @param {ICustomer} customer
   */
  public validateNotAlreadyPublished = (customer: Customer) => {
    if (customer.active) {
      throw new ServiceError(ERRORS.CUSTOMER_ALREADY_ACTIVE);
    }
  };

  /**
   * Validates the given code is unique among customers.
   * @param {string | null | undefined} code
   * @param {number} [exceptCustomerId] - Customer id to exclude (on edit).
   */
  public validateCustomerCodeUnique = async (
    code: string | null | undefined,
    exceptCustomerId?: number,
  ) => {
    if (!code) {
      return;
    }
    const customer = await this.customerModel()
      .query()
      .onBuild((query) => {
        query.select(['id']);
        query.where('code', code);

        if (exceptCustomerId) {
          query.whereNot('id', exceptCustomerId);
        }
      })
      .first();

    if (customer) {
      throw new ServiceError(ERRORS.CUSTOMER_CODE_NOT_UNIQUE);
    }
  };
}
