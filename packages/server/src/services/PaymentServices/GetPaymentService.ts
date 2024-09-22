import { Inject, Service } from 'typedi';
import HasTenancyService from '../Tenancy/TenancyService';
import { GetPaymentMethodsPOJO } from './types';

@Service()
export class GetPaymentMethodService {
  @Inject()
  private tenancy: HasTenancyService;

  /**
   * Retrieves the payment state provising state.
   * @param {number} tenantId
   * @returns {Promise<GetPaymentMethodsPOJO>}
   */
  public async getPaymentMethod(
    tenantId: number,
    paymentServiceId: number
  ): Promise<GetPaymentMethodsPOJO> {
    const { PaymentIntegration } = this.tenancy.models(tenantId);

    const stripePayment = await PaymentIntegration.query()
      .findById(paymentServiceId)
      .throwIfNotFound();

    return stripePayment;
  }
}
