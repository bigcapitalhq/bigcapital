import { Inject, Service } from 'typedi';
import events from '@/subscribers/events';
import HasTenancyService from '@/services/Tenancy/TenancyService';
import { StripeOAuthCodeGrantedEventPayload } from '../types';

@Service()
export class SeedStripeAccountsOnOAuthGrantedSubscriber {
  @Inject()
  private tenancy: HasTenancyService;

  /**
   * Attaches the subscriber to the event dispatcher.
   */
  public attach(bus) {
    bus.subscribe(
      events.stripeIntegration.onOAuthCodeGranted,
      this.handleSeedStripeAccount.bind(this)
    );
  }

  /**
   * Seeds the default integration settings once oauth authorization code granted.
   * @param {StripeCheckoutSessionCompletedEventPayload} payload -
   */
  async handleSeedStripeAccount({
    tenantId,
    paymentIntegrationId,
    trx,
  }: StripeOAuthCodeGrantedEventPayload) {
    const { PaymentIntegration } = this.tenancy.models(tenantId);
    const { accountRepository } = this.tenancy.repositories(tenantId);

    const clearingAccount = await accountRepository.findOrCreateStripeClearing(
      {},
      trx
    );
    const bankAccount = await accountRepository.findBySlug('bank-account');

    // Patch the Stripe integration default settings.
    await PaymentIntegration.query(trx)
      .findById(paymentIntegrationId)
      .patch({
        options: {
          bankAccountId: bankAccount.id,
          clearingAccountId: clearingAccount.id,
        },
      });
  }
}
