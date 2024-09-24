import { Inject, Service } from 'typedi';
import { StripePaymentService } from '@/services/StripePayment/StripePaymentService';
import HasTenancyService from '@/services/Tenancy/TenancyService';
import { CreateStripeAccountDTO } from './types';
import { EventPublisher } from '@/lib/EventPublisher/EventPublisher';
import events from '@/subscribers/events';

@Service()
export class CreateStripeAccountService {
  @Inject()
  private tenancy: HasTenancyService;

  @Inject()
  private stripePaymentService: StripePaymentService;

  @Inject()
  private eventPublisher: EventPublisher;

  /**
   * Creates a new Stripe account.
   * @param {number} tenantI
   * @param {CreateStripeAccountDTO} stripeAccountDTO
   * @returns {Promise<string>}
   */
  async createStripeAccount(
    tenantId: number,
    stripeAccountDTO?: CreateStripeAccountDTO
  ): Promise<string> {
    const { PaymentIntegration } = this.tenancy.models(tenantId);
    const stripeAccount = await this.stripePaymentService.createAccount();
    const stripeAccountId = stripeAccount.id;

    const parsedStripeAccountDTO = {
      name: 'Stripe',
      ...stripeAccountDTO,
    };
    // Stores the details of the Stripe account.
    await PaymentIntegration.query().insert({
      name: parsedStripeAccountDTO.name,
      accountId: stripeAccountId,
      active: false, // Active will turn true after onboarding.
      service: 'Stripe',
    });
    // Triggers `onStripeIntegrationAccountCreated` event.
    await this.eventPublisher.emitAsync(
      events.stripeIntegration.onAccountCreated,
      {
        tenantId,
        stripeAccountDTO,
        stripeAccountId,
      }
    );
    return stripeAccountId;
  }
}
