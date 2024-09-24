import { Service, Inject } from 'typedi';
import { StripePaymentService } from './StripePaymentService';

@Service()
export class CreateStripeAccountLinkService {
  @Inject()
  private stripePaymentService: StripePaymentService;

  /**
   * Creates a new Stripe account id.
   * @param {number} tenantId
   */
  public createAccountLink(tenantId: number, stripeAccountId: string) {
    return this.stripePaymentService.createAccountLink(stripeAccountId);
  }
}
