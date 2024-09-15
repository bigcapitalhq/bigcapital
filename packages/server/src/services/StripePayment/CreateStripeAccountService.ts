import { Inject, Service } from 'typedi';
import { snakeCase } from 'lodash';
import { StripePaymentService } from './StripePaymentService';
import HasTenancyService from '../Tenancy/TenancyService';

interface CreateStripeAccountDTO {
  name: string;
}

@Service()
export class CreateStripeAccountService {
  @Inject()
  private stripePaymentService: StripePaymentService;

  @Inject()
  private tenancy: HasTenancyService;

  /**
   * Creates a new Stripe account for Bigcapital.
   * @param {number} tenantId 
   * @param {number} createStripeAccountDTO 
   */
  async createAccount(
    tenantId: number,
    createStripeAccountDTO: CreateStripeAccountDTO
  ) {
    const { PaymentIntegration } = this.tenancy.models(tenantId);

    // Creates a new Stripe account.
    const account = await this.stripePaymentService.createAccount();
  
    const slug = snakeCase(createStripeAccountDTO.name);

    // Store the Stripe account on tenant store.
    await PaymentIntegration.query().insert({
      service: 'stripe',
      name: createStripeAccountDTO.name,
      slug,
      enable: true,
      accountId: account.id,
    });
  }
}
