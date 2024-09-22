import { Inject, Service } from 'typedi';
import HasTenancyService from '../Tenancy/TenancyService';
import { GetPaymentMethodsPOJO } from './types';
import config from '@/config';

@Service()
export class GetPaymentMethodsStateService {
  @Inject()
  private tenancy: HasTenancyService;

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
    const isStripePaymentActive = !!(stripePayment?.active || null);

    const stripePaymentMethodId = stripePayment?.id || null;
    const stripeAccountId = stripePayment?.accountId || null;
    const stripePublishableKey = config.stripePayment.publishableKey;
    const stripeCurrencies = ['USD', 'EUR'];
    const stripeRedirectUrl = 'https://your-stripe-redirect-url.com';

    const paymentMethodPOJO: GetPaymentMethodsPOJO = {
      stripe: {
        isStripeAccountCreated,
        isStripePaymentActive,
        stripeAccountId,
        stripePaymentMethodId,
        stripePublishableKey,
        stripeCurrencies,
        stripeRedirectUrl,
      },
    };
    return paymentMethodPOJO;
  }
}
