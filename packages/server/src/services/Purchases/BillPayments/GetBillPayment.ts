import { IBillPayment } from '@/interfaces';
import HasTenancyService from '@/services/Tenancy/TenancyService';
import { Inject, Service } from 'typedi';
import { ERRORS } from './constants';
import { ServiceError } from '@/exceptions';
import { BillPaymentTransformer } from './BillPaymentTransformer';
import { TransformerInjectable } from '@/lib/Transformer/TransformerInjectable';

@Service()
export class GetBillPayment {
  @Inject()
  private tenancy: HasTenancyService;

  @Inject()
  private transformer: TransformerInjectable;

  /**
   * Retrieve bill payment.
   * @param {number} tenantId
   * @param {number} billPyamentId
   * @return {Promise<IBillPayment>}
   */
  public async getBillPayment(
    tenantId: number,
    billPyamentId: number
  ): Promise<IBillPayment> {
    const { BillPayment } = this.tenancy.models(tenantId);

    const billPayment = await BillPayment.query()
      .withGraphFetched('entries.bill')
      .withGraphFetched('vendor')
      .withGraphFetched('paymentAccount')
      .withGraphFetched('transactions')
      .withGraphFetched('branch')
      .findById(billPyamentId);

    if (!billPayment) {
      throw new ServiceError(ERRORS.PAYMENT_MADE_NOT_FOUND);
    }
    return this.transformer.transform(
      tenantId,
      billPayment,
      new BillPaymentTransformer()
    );
  }
}
