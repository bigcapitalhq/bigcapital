import { Service } from 'typedi';
import stripe from 'stripe';
import config from '@/config';

@Service()
export class StripePaymentService {
  private stripe;

  constructor() {
    this.stripe = new stripe(config.stripePayment.secretKey, {
      apiVersion: '2023-10-16',
    });
  }

  public async createAccountSession(accountId: string) {
    try {
      const accountSession = await this.stripe.accountSessions.create({
        account: accountId,
        components: {
          account_onboarding: { enabled: true },
        },
      });
      return accountSession.client_secret;
    } catch (error) {
      throw new Error(
        'An error occurred when calling the Stripe API to create an account session'
      );
    }
  }

  public async createAccount() {
    try {
      const account = await this.stripe.accounts.create({});

      return account.id;
    } catch (error) {
      throw new Error(
        'An error occurred when calling the Stripe API to create an account'
      );
    }
  }
}
