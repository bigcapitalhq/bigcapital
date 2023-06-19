import { TransformerInjectable } from '@/lib/Transformer/TransformerInjectable';
import I18nService from '@/services/I18n/I18nService';
import HasTenancyService from '@/services/Tenancy/TenancyService';
import { Service, Inject } from 'typedi';
import CustomerTransformer from '../CustomerTransformer';

@Service()
export class GetCustomer {
  @Inject()
  private tenancy: HasTenancyService;

  @Inject()
  private transformer: TransformerInjectable;

  /**
   * Retrieve the given customer details.
   * @param {number} tenantId
   * @param {number} customerId
   */
  public async getCustomer(tenantId: number, customerId: number) {
    const { Contact } = this.tenancy.models(tenantId);

    // Retrieve the customer model or throw not found error.
    const customer = await Contact.query()
      .modify('customer')
      .findById(customerId)
      .throwIfNotFound();

    // Retrieves the transformed customers.
    return this.transformer.transform(
      tenantId,
      customer,
      new CustomerTransformer()
    );
  }
}
