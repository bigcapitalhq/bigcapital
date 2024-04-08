import { ServiceError } from '@/exceptions';
import { IPaymentReceive } from '@/interfaces';
import { TransformerInjectable } from '@/lib/Transformer/TransformerInjectable';
import HasTenancyService from '@/services/Tenancy/TenancyService';
import { Inject, Service } from 'typedi';
import { PaymentReceiveTransfromer } from './PaymentReceiveTransformer';
import { ERRORS } from './constants';

@Service()
export class GetPaymentReceive {
  @Inject()
  private tenancy: HasTenancyService;

  @Inject()
  private transformer: TransformerInjectable;

  /**
   * Retrieve payment receive details.
   * @param {number} tenantId - Tenant id.
   * @param {number} paymentReceiveId - Payment receive id.
   * @return {Promise<IPaymentReceive>}
   */
  public async getPaymentReceive(tenantId: number, paymentReceiveId: number): Promise<IPaymentReceive> {
    const { PaymentReceive } = this.tenancy.models(tenantId);

    const paymentReceive = await PaymentReceive.query()
      .withGraphFetched('customer')
      .withGraphFetched('depositAccount')
      .withGraphFetched('entries.invoice')
      .withGraphFetched('transactions')
      .withGraphFetched('branch')
      .findById(paymentReceiveId);

    if (!paymentReceive) {
      throw new ServiceError(ERRORS.PAYMENT_RECEIVE_NOT_EXISTS);
    }
    return this.transformer.transform(tenantId, paymentReceive, new PaymentReceiveTransfromer());
  }
}
