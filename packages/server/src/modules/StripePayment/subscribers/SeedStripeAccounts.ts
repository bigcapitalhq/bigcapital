import { OnEvent } from '@nestjs/event-emitter';
import { Inject, Injectable } from '@nestjs/common';
import { events } from '@/common/events/events';
import { AccountRepository } from '@/modules/Accounts/repositories/Account.repository';
import { PaymentIntegration } from '../models/PaymentIntegration.model';
import { StripeOAuthCodeGrantedEventPayload } from '../types';
import { TenantModelProxy } from '@/modules/System/models/TenantBaseModel';

@Injectable()
export class SeedStripeAccountsOnOAuthGrantedSubscriber {
  /**
   * @param {AccountRepository} accountRepository
   * @param {TenantModelProxy<typeof PaymentIntegration>} paymentIntegrationModel
   */
  constructor(
    private readonly accountRepository: AccountRepository,

    @Inject(PaymentIntegration.name)
    private readonly paymentIntegrationModel: TenantModelProxy<
      typeof PaymentIntegration
    >,
  ) {}

  /**
   * Seeds the default integration settings once oauth authorization code granted.
   * @param {StripeCheckoutSessionCompletedEventPayload} payload -
   */
  @OnEvent(events.stripeIntegration.onOAuthCodeGranted)
  async handleSeedStripeAccount({
    paymentIntegrationId,
    trx,
  }: StripeOAuthCodeGrantedEventPayload) {
    const clearingAccount =
      await this.accountRepository.findOrCreateStripeClearing({}, trx);

    const bankAccount = await this.accountRepository.findBySlug('bank-account');

    // Patch the Stripe integration default settings.
    await this.paymentIntegrationModel()
      .query(trx)
      .findById(paymentIntegrationId)
      .patch({
        options: {
          // @ts-ignore
          bankAccountId: bankAccount.id,
          clearingAccountId: clearingAccount.id,
        },
      });
  }
}
