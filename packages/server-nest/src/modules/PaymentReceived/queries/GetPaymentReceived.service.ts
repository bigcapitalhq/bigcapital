import { Injectable } from '@nestjs/common';
import { ERRORS } from '../constants';
import { PaymentReceiveTransfromer } from './PaymentReceivedTransformer';
import { PaymentReceived } from '../models/PaymentReceived';
import { TransformerInjectable } from '../../Transformer/TransformerInjectable.service';
import { ServiceError } from '../../Items/ServiceError';

@Injectable()
export class GetPaymentReceived {
  constructor(
    private readonly paymentReceiveModel: typeof PaymentReceived,
    private readonly transformer: TransformerInjectable,
  ) {}

  /**
   * Retrieve payment receive details.
   * @param {number} paymentReceiveId - Payment receive id.
   * @return {Promise<IPaymentReceived>}
   */
  public async getPaymentReceive(
    paymentReceiveId: number
  ): Promise<PaymentReceived> {
    const paymentReceive = await this.paymentReceiveModel.query()
      .withGraphFetched('customer')
      .withGraphFetched('depositAccount')
      .withGraphFetched('entries.invoice')
      .withGraphFetched('transactions')
      .withGraphFetched('branch')
      .findById(paymentReceiveId);

    if (!paymentReceive) {
      throw new ServiceError(ERRORS.PAYMENT_RECEIVE_NOT_EXISTS);
    }
    return this.transformer.transform(
      paymentReceive,
      new PaymentReceiveTransfromer()
    );
  }
}
