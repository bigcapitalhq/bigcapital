import { Service } from 'typedi';
import stripe from 'stripe';
import config from '@/config';

@Service()
export class StripePaymentService {
  public stripe;

  constructor() {
    this.stripe = new stripe(config.stripePayment.secretKey, {
      apiVersion: '2024-06-20',
    });
  }

  /**
   * 
   * @param {number} accountId 
   * @returns {Promise<string>}
   */
  public async createAccountSession(accountId: string): Promise<string> {
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

  /**
   * 
   * @returns {Promise<string>}
   */
  public async createAccount(): Promise<string> {
    try {
      const account = await this.stripe.accounts.create({});

      return account;
    } catch (error) {
      throw new Error(
        'An error occurred when calling the Stripe API to create an account'
      );
    }
  }
}
