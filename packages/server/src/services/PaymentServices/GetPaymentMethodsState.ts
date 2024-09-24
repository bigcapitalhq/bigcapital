import { Inject, Service } from 'typedi';
import HasTenancyService from '../Tenancy/TenancyService';
import { GetPaymentMethodsPOJO } from './types';
import config from '@/config';
import { isStripePaymentConfigured } from './utils';
import { GetStripeAuthorizationLinkService } from '../StripePayment/GetStripeAuthorizationLink';

@Service()
export class GetPaymentMethodsStateService {
  @Inject()
  private tenancy: HasTenancyService;

  @Inject()
  private getStripeAuthorizationLinkService: GetStripeAuthorizationLinkService;

  /**
   * Retrieves the payment state provising state.
   * @param {number} tenantId
   * @returns {Promise<GetPaymentMethodsPOJO>}
   */
  public async getPaymentMethodsState(
    tenantId: number
  ): Promise<GetPaymentMethodsPOJO> {
    const { PaymentIntegration } = this.tenancy.models(tenantId);

    const stripePayment = await PaymentIntegration.query()
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
    const stripePublishableKey = config.stripePayment.publishableKey;
    const stripeCurrencies = ['USD', 'EUR'];
    const stripeRedirectUrl = 'https://your-stripe-redirect-url.com';
    const isStripeServerConfigured = isStripePaymentConfigured();
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
}
