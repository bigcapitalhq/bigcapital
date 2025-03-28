import { Inject, Injectable } from '@nestjs/common';
import { TenantModelProxy } from '@/modules/System/models/TenantBaseModel';
import { GetPaymentMethodsPOJO } from '../types';
import { PaymentIntegration } from '../models/PaymentIntegration.model';
import { ModelObject } from 'objection';

@Injectable()
export class GetPaymentMethodService {
  constructor(
    @Inject(PaymentIntegration.name)
    private readonly paymentIntegrationModel: TenantModelProxy<
      typeof PaymentIntegration
    >,
  ) {}

  /**
   * Retrieves the payment state provising state.
   * @returns {Promise<GetPaymentMethodsPOJO>}
   */
  public async getPaymentMethod(
    paymentServiceId: number,
  ): Promise<ModelObject<PaymentIntegration>> {
    const stripePayment = await this.paymentIntegrationModel()
      .query()
      .findById(paymentServiceId)
      .throwIfNotFound();

    return stripePayment;
  }
}
