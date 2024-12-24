import { Inject, Injectable } from '@nestjs/common';
import { TransformerInjectable } from '../../Transformer/TransformerInjectable.service';
import { BillPayment } from '../models/BillPayment';
import { BillPaymentTransformer } from './BillPaymentTransformer';

@Injectable()
export class GetBillPayment {
  constructor(
    private readonly transformer: TransformerInjectable,

    @Inject(BillPayment.name)
    private readonly billPaymentModel: typeof BillPayment,
  ) {}

  /**
   * Retrieves bill payment.
   * @param {number} billPyamentId
   * @return {Promise<BillPayment>}
   */
  public async getBillPayment(billPyamentId: number): Promise<BillPayment> {
    const billPayment = await this.billPaymentModel
      .query()
      .withGraphFetched('entries.bill')
      .withGraphFetched('vendor')
      .withGraphFetched('paymentAccount')
      .withGraphFetched('transactions')
      .withGraphFetched('branch')
      .withGraphFetched('attachments')
      .findById(billPyamentId)
      .throwIfNotFound();

    return this.transformer.transform(
      billPayment,
      new BillPaymentTransformer(),
    );
  }
}
