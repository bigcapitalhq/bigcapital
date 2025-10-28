import { StripePaymentService } from './StripePaymentService';
import { Injectable } from '@nestjs/common';

@Injectable()
export class CreateStripeAccountLinkService {
  constructor(private readonly stripePaymentService: StripePaymentService) {}

  /**
   * Creates a new Stripe account id.
   * @param {string} stripeAccountId - Stripe account id.
   */
  public createAccountLink(stripeAccountId: string) {
    return this.stripePaymentService.createAccountLink(stripeAccountId);
  }
}
