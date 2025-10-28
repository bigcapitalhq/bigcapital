import { CreateStripeAccountDTO } from './types';
import { Inject, Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { StripePaymentService } from './StripePaymentService';
import { events } from '@/common/events/events';
import { PaymentIntegration } from './models/PaymentIntegration.model';
import { TenantModelProxy } from '../System/models/TenantBaseModel';

@Injectable()
export class CreateStripeAccountService {
  constructor(
    private readonly stripePaymentService: StripePaymentService,
    private readonly eventPublisher: EventEmitter2,

    @Inject(PaymentIntegration.name)
    private readonly paymentIntegrationModel: TenantModelProxy<
      typeof PaymentIntegration
    >,
  ) {}

  /**
   * Creates a new Stripe account.
   * @param {CreateStripeAccountDTO} stripeAccountDTO
   * @returns {Promise<string>}
   */
  async createStripeAccount(
    stripeAccountDTO?: CreateStripeAccountDTO,
  ): Promise<string> {
    const stripeAccount = await this.stripePaymentService.createAccount();
    const stripeAccountId = stripeAccount.id;

    const parsedStripeAccountDTO = {
      name: 'Stripe',
      ...stripeAccountDTO,
    };
    // Stores the details of the Stripe account.
    await this.paymentIntegrationModel().query().insert({
      name: parsedStripeAccountDTO.name,
      accountId: stripeAccountId,
      active: false, // Active will turn true after onboarding.
      service: 'Stripe',
    });
    // Triggers `onStripeIntegrationAccountCreated` event.
    await this.eventPublisher.emitAsync(
      events.stripeIntegration.onAccountCreated,
      {
        stripeAccountDTO,
        stripeAccountId,
      },
    );
    return stripeAccountId;
  }
}
