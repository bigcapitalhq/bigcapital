import { Inject, Service } from 'typedi';
import { StripePaymentService } from './StripePaymentService';
import events from '@/subscribers/events';
import HasTenancyService from '../Tenancy/TenancyService';
import { EventPublisher } from '@/lib/EventPublisher/EventPublisher';
import UnitOfWork from '../UnitOfWork';
import { Knex } from 'knex';
import { StripeOAuthCodeGrantedEventPayload } from './types';

@Service()
export class ExchangeStripeOAuthTokenService {
  @Inject()
  private stripePaymentService: StripePaymentService;

  @Inject()
  private tenancy: HasTenancyService;

  @Inject()
  private eventPublisher: EventPublisher;

  @Inject()
  private uow: UnitOfWork;

  /**
   * Exchange stripe oauth authorization code to access token and user id.
   * @param {number} tenantId
   * @param {string} authorizationCode
   */
  public async excahngeStripeOAuthToken(
    tenantId: number,
    authorizationCode: string
  ) {
    const { PaymentIntegration } = this.tenancy.models(tenantId);
    const stripe = this.stripePaymentService.stripe;

    const response = await stripe.oauth.token({
      grant_type: 'authorization_code',
      code: authorizationCode,
    });
    // const accessToken = response.access_token;
    // const refreshToken = response.refresh_token;
    const stripeUserId = response.stripe_user_id;

    // Retrieves details of the Stripe account.
    const account = await stripe.accounts.retrieve(stripeUserId, {
      expand: ['business_profile'],
    });
    const companyName = account.business_profile?.name || 'Unknow name';
    const paymentEnabled = account.charges_enabled;
    const payoutEnabled = account.payouts_enabled;

    //
    return this.uow.withTransaction(tenantId, async (trx: Knex.Transaction) => {
      // Stores the details of the Stripe account.
      const paymentIntegration = await PaymentIntegration.query(trx).insert({
        name: companyName,
        service: 'Stripe',
        accountId: stripeUserId,
        paymentEnabled,
        payoutEnabled,
      });
      // Triggers `onStripeOAuthCodeGranted` event.
      await this.eventPublisher.emitAsync(
        events.stripeIntegration.onOAuthCodeGranted,
        {
          tenantId,
          paymentIntegrationId: paymentIntegration.id,
          trx,
        } as StripeOAuthCodeGrantedEventPayload
      );
    });
  }
}
