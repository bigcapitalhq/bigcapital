import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GetPaymentMethodsPOJO } from '../types';
import { GetStripeAuthorizationLinkService } from '../../StripePayment/GetStripeAuthorizationLink';
import { PaymentIntegration } from '../models/PaymentIntegration.model';
import { TenantModelProxy } from '@/modules/System/models/TenantBaseModel';

@Injectable()
export class GetPaymentMethodsStateService {
  constructor(
    private readonly getStripeAuthorizationLinkService: GetStripeAuthorizationLinkService,
    private readonly configService: ConfigService,

    @Inject(PaymentIntegration.name)
    private readonly paymentIntegrationModel: TenantModelProxy<
      typeof PaymentIntegration
    >,
  ) { }

  /**
   * Retrieves the payment state provising state.
   * @param {number} tenantId
   * @returns {Promise<GetPaymentMethodsPOJO>}
   */
  public async getPaymentMethodsState(): Promise<GetPaymentMethodsPOJO> {
    const stripePayment = await this.paymentIntegrationModel()
      .query()
      .orderBy('createdAt', 'ASC')
      .findOne({
        service: 'Stripe',
      });
    const isStripeAccountCreated = !!stripePayment;
    const isStripePaymentEnabled = stripePayment?.paymentEnabled;
    const isStripePayoutEnabled = stripePayment?.payoutEnabled;
    const isStripeEnabled = stripePayment?.fullEnabled;

    const stripePaymentMethodId = stripePayment?.id || null;
    const stripeAccountId = stripePayment?.accountId || null;
    const stripePublishableKey = this.configService.get(
      'stripePayment.publishableKey',
    );
    const stripeCurrencies = ['USD', 'EUR'];
    const stripeRedirectUrl = 'https://your-stripe-redirect-url.com';
    const isStripeServerConfigured = this.isStripePaymentConfigured();
    const stripeAuthLink =
      this.getStripeAuthorizationLinkService.getStripeAuthLink();

    const paymentMethodPOJO: GetPaymentMethodsPOJO = {
      stripe: {
        isStripeAccountCreated,
        isStripePaymentEnabled,
        isStripePayoutEnabled,
        isStripeEnabled,
        isStripeServerConfigured,
        stripeAccountId,
        stripePaymentMethodId,
        stripePublishableKey,
        stripeCurrencies,
        stripeAuthLink,
        stripeRedirectUrl,
      },
    };
    return paymentMethodPOJO;
  }

  /**
   * Determines if Stripe payment is configured.
   * @returns {boolean}
   */
  private isStripePaymentConfigured() {
    return (
      this.configService.get('stripePayment.secretKey') &&
      this.configService.get('stripePayment.publishableKey') &&
      this.configService.get('stripePayment.webhooksSecret')
    );
  }
}
