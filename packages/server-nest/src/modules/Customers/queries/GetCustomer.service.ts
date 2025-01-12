
import { Inject, Injectable } from '@nestjs/common';
import { CustomerTransfromer } from './CustomerTransformer';
import { TransformerInjectable } from '@/modules/Transformer/TransformerInjectable.service';
import { Customer } from '../models/Customer';

@Injectable()
export class GetCustomerService {
  constructor(
    private transformer: TransformerInjectable,
    @Inject(Customer.name) private customerModel: typeof Customer,
  ) {}

  /**
   * Retrieve the given customer details.
   * @param {number} customerId
   */
  public async getCustomer(customerId: number) {
    // Retrieve the customer model or throw not found error.
    const customer = await this.customerModel
      .query()
      .findById(customerId)
      .throwIfNotFound();

    // Retrieves the transformered customers.
    return this.transformer.transform(
      customer,
      new CustomerTransfromer()
    );
  }
}
