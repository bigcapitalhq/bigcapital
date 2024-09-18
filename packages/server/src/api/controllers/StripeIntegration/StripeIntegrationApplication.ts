import { Service, Inject } from 'typedi';
import { CreateStripeAccountService } from './CreateStripeAccountService';
import { CreateStripeAccountDTO } from './types';
@Service()
export class StripeIntegrationApplication {
  @Inject()
  private createStripeAccountService: CreateStripeAccountService;

  /**
   * Creates a new Stripe account for the tenant.
   * @param {TenantContext} tenantContext - The tenant context.
   * @param {string} label - The label for the Stripe account.
   * @returns {Promise<string>} The ID of the created Stripe account.
   */
  public async createStripeAccount(
    tenantId: number,
    stripeAccountDTO?: CreateStripeAccountDTO
  ): Promise<string> {
    return this.createStripeAccountService.createStripeAccount(
      tenantId,
      stripeAccountDTO
    );
  }
}
