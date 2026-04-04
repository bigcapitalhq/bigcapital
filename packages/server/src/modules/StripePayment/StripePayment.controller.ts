import { Body, Controller, Get, Injectable, Post } from '@nestjs/common';
import { StripePaymentApplication } from './StripePaymentApplication';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { GetStripeConnectLinkResponseDto } from './dtos/GetStripeConnectLinkResponse.dto';
import { ExchangeStripeOAuthBodyDto } from './dtos/ExchangeStripeOAuthBody.dto';
import { CreateStripeAccountLinkBodyDto } from './dtos/CreateStripeAccountLinkBody.dto';
import { CreateStripeAccountLinkResponseDto } from './dtos/CreateStripeAccountLinkResponse.dto';
import { CreateStripeAccountResponseDto } from './dtos/CreateStripeAccountResponse.dto';
import { CreateStripeAccountSessionBodyDto } from './dtos/CreateStripeAccountSessionBody.dto';
import { CreateStripeAccountSessionResponseDto } from './dtos/CreateStripeAccountSessionResponse.dto';

@Controller('/stripe')
@ApiTags('stripe')
export class StripeIntegrationController {
  constructor(private readonly stripePaymentApp: StripePaymentApplication) {}

  /**
   * Retrieves Stripe OAuth2 connect link.
   */
  @Get('/link')
  @ApiOperation({
    summary: 'Get Stripe Connect link',
    description: 'Retrieves the Stripe OAuth2 Connect authorization URL',
  })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved Stripe Connect link',
    type: GetStripeConnectLinkResponseDto,
  })
  public async getStripeConnectLink() {
    const authorizationUri = this.stripePaymentApp.getStripeConnectLink();

    return { url: authorizationUri };
  }

  /**
   * Exchanges the given Stripe authorization code to Stripe user id and access token.
   */
  @Post('/callback')
  @ApiOperation({
    summary: 'Exchange Stripe OAuth code',
    description:
      'Exchanges the Stripe authorization code for user id and access token',
  })
  @ApiBody({ type: ExchangeStripeOAuthBodyDto })
  @ApiResponse({
    status: 201,
    description: 'Successfully exchanged OAuth code',
  })
  public async exchangeOAuth(@Body() body: ExchangeStripeOAuthBodyDto) {
    await this.stripePaymentApp.exchangeStripeOAuthToken(body.code);

    return {};
  }

  /**
   * Creates a new Stripe account.
   */
  @Post('/account')
  @ApiOperation({
    summary: 'Create Stripe account',
    description: 'Creates a new Stripe Connect account',
  })
  @ApiResponse({
    status: 201,
    description: 'Successfully created Stripe account',
    type: CreateStripeAccountResponseDto,
  })
  public async createAccount() {
    const accountId = await this.stripePaymentApp.createStripeAccount();
    return { account_id: accountId };
  }

  /**
   * Creates a Stripe account session for the Connect embedded component.
   */
  @Post('/account_session')
  @ApiOperation({
    summary: 'Create Stripe account session',
    description:
      'Creates an account session for the Stripe Connect embedded component',
  })
  @ApiBody({ type: CreateStripeAccountSessionBodyDto })
  @ApiResponse({
    status: 201,
    description: 'Successfully created account session',
    type: CreateStripeAccountSessionResponseDto,
  })
  public async createAccountSession(
    @Body() body: CreateStripeAccountSessionBodyDto,
  ) {
    const clientSecret = await this.stripePaymentApp.createAccountSession(
      body.account ?? '',
    );
    return { client_secret: clientSecret };
  }

  /**
   * Creates a new Stripe account link for onboarding.
   */
  @Post('/account_link')
  @ApiOperation({
    summary: 'Create Stripe account link',
    description: 'Creates a Stripe Connect account link for onboarding',
  })
  @ApiBody({ type: CreateStripeAccountLinkBodyDto })
  @ApiResponse({
    status: 201,
    description: 'Successfully created account link',
    type: CreateStripeAccountLinkResponseDto,
  })
  public async createAccountLink(@Body() body: CreateStripeAccountLinkBodyDto) {
    const clientSecret = await this.stripePaymentApp.createAccountLink(
      body.stripeAccountId,
    );

    return { clientSecret };
  }
}
