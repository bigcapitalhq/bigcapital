import { TransformerInjectable } from '@/lib/Transformer/TransformerInjectable';
import HasTenancyService from '@/services/Tenancy/TenancyService';
import { Inject, Service } from 'typedi';
import CustomerTransfromer from '../CustomerTransformer';

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
    const customer = await Contact.query().modify('customer').findById(customerId).throwIfNotFound();

    // Retrieves the transformered customers.
    return this.transformer.transform(tenantId, customer, new CustomerTransfromer());
  }
}
