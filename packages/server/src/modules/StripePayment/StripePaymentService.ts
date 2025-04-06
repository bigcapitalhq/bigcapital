import { Injectable, Scope } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import stripe from 'stripe';

const origin = 'https://cfdf-102-164-97-88.ngrok-free.app';

@Injectable({ scope: Scope.DEFAULT })
export class StripePaymentService {
  public stripe: stripe;

  /**
   * Constructor method.
   * @param {ConfigService} config - ConfigService instance
   */
  constructor(private readonly config: ConfigService) {
    const secretKey = this.config.get('stripePayment.secretKey');
    this.stripe = new stripe(secretKey, {
      apiVersion: '2024-06-20',
    });
  }

  /**
   * Creates a new Stripe account session.
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
        'An error occurred when calling the Stripe API to create an account session',
      );
    }
  }

  /**
   * Creates a new Stripe account link.
   * @param {number} accountId - Account id.
   * @returns {Promise<stripe.Response<stripe.AccountLink>}
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
        'An error occurred when calling the Stripe API to create an account link:',
      );
    }
  }

  /**
   * C
   * @returns {Promise<stripe.Response<stripe.Account>>}
   */
  public async createAccount() {
    try {
      const account = await this.stripe.accounts.create({
        type: 'standard',
      });
      return account;
    } catch (error) {
      throw new Error(
        'An error occurred when calling the Stripe API to create an account',
      );
    }
  }
}
