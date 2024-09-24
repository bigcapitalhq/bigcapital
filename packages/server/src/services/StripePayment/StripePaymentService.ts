import { Service } from 'typedi';
import stripe from 'stripe';
import config from '@/config';

const origin = 'https://cfdf-102-164-97-88.ngrok-free.app';

@Service()
export class StripePaymentService {
  public stripe: stripe;

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
   * @param {number} accountId
   * @returns
   */
  public async createAccountLink(accountId: string) {
    try {
      const accountLink = await this.stripe.accountLinks.create({
        account: accountId,
        return_url: `${origin}/return/${accountId}`,
        refresh_url: `${origin}/refresh/${accountId}`,
        type: 'account_onboarding',
      });
      return accountLink;
    } catch (error) {
      throw new Error(
        'An error occurred when calling the Stripe API to create an account link:'
      );
    }
  }

  /**
   *
   * @returns {Promise<string>}
   */
  public async createAccount(): Promise<string> {
    try {
      const account = await this.stripe.accounts.create({
        type: 'standard',
      });
      return account;
    } catch (error) {
      throw new Error(
        'An error occurred when calling the Stripe API to create an account'
      );
    }
  }
}
