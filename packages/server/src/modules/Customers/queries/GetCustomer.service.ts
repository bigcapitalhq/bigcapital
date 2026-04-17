import { Inject, Injectable } from '@nestjs/common';
import { CustomerTransfromer } from './CustomerTransformer';
import { TransformerInjectable } from '@/modules/Transformer/TransformerInjectable.service';
import { Customer } from '../models/Customer';
import { TenantModelProxy } from '@/modules/System/models/TenantBaseModel';
import { GetResourceCustomFieldsService } from '@/modules/CustomFields/queries/GetResourceCustomFields.service';

@Injectable()
export class GetCustomerService {
  constructor(
    private transformer: TransformerInjectable,
    private getResourceCustomFieldsService: GetResourceCustomFieldsService,

    @Inject(Customer.name)
    private customerModel: TenantModelProxy<typeof Customer>,
  ) {}

  /**
   * Retrieve the given customer details.
   * @param {number} customerId
   */
  public async getCustomer(customerId: number) {
    // Retrieve the customer model or throw not found error.
    const customer = await this.customerModel()
      .query()
      .findById(customerId)
      .throwIfNotFound();

    // Load custom field values.
    const customFields = await this.getResourceCustomFieldsService.getResourceCustomFields(
      'Customer',
      customerId,
    );

    // Retrieves the transformered customers.
    const transformed = await this.transformer.transform(
      customer,
      new CustomerTransfromer(),
      { customFields },
    );

    return transformed;
  }
}
