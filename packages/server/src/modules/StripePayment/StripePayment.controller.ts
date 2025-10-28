import { Body, Controller, Get, Injectable, Post } from '@nestjs/common';
import { StripePaymentApplication } from './StripePaymentApplication';
import { ApiTags } from '@nestjs/swagger';

@Controller('/stripe')
@ApiTags('stripe')
export class StripeIntegrationController {
  constructor(private readonly stripePaymentApp: StripePaymentApplication) {}

  /**
   * Retrieves Stripe OAuth2 connect link.
   * @returns {Promise<Response|void>}
   */
  @Get('/link')
  public async getStripeConnectLink() {
    const authorizationUri = this.stripePaymentApp.getStripeConnectLink();

    return { url: authorizationUri };
  }

  /**
   * Exchanges the given Stripe authorization code to Stripe user id and access token.
   * @returns {Promise<void>}
   */
  @Post('/callback')
  public async exchangeOAuth(@Body('code') code: string) {
    await this.stripePaymentApp.exchangeStripeOAuthToken(code);

    return {};
  }

  /**
   * Creates a new Stripe account.
   * @returns {Promise<void>}
   */
  public async createAccount() {
    const accountId = await this.stripePaymentApp.createStripeAccount();
    return {
      accountId,
      message: 'The Stripe account has been created successfully.',
    };
  }

  /**
   * Creates a new Stripe account session.
   * @returns {Promise<void>}
   */
  @Post('/account_link')
  public async createAccountLink(
    @Body('stripeAccountId') stripeAccountId: string,
  ) {
    const clientSecret =
      await this.stripePaymentApp.createAccountLink(stripeAccountId);

    return { clientSecret };
  }
}
