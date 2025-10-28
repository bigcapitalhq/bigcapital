import { Inject, Injectable } from '@nestjs/common';
import { TransformerInjectable } from '@/modules/Transformer/TransformerInjectable.service';
import { GetPaymentReceivedMailStateTransformer } from './GetPaymentReceivedMailState.transformer';
import { SendPaymentReceiveMailNotification } from '../commands/PaymentReceivedMailNotification';
import { PaymentReceived } from '../models/PaymentReceived';
import { TenantModelProxy } from '@/modules/System/models/TenantBaseModel';
import { PaymentReceiveMailOpts } from '../types/PaymentReceived.types';

@Injectable()
export class GetPaymentReceivedMailState {
  constructor(
    private readonly paymentReceivedMail: SendPaymentReceiveMailNotification,
    private readonly transformer: TransformerInjectable,

    @Inject(PaymentReceived.name)
    private readonly paymentReceivedModel: TenantModelProxy<
      typeof PaymentReceived
    >,
  ) {}

  /**
   * Retrieves the default payment mail options.
   * @param {number} paymentReceiveId - Payment receive id.
   * @returns {Promise<PaymentReceiveMailOpts>}
   */
  public getMailOptions = async (
    paymentId: number,
  ): Promise<PaymentReceiveMailOpts> => {
    const paymentReceive = await this.paymentReceivedModel()
      .query()
      .findById(paymentId)
      .withGraphFetched('customer')
      .withGraphFetched('entries.invoice')
      .withGraphFetched('pdfTemplate')
      .throwIfNotFound();

    const mailOptions =
      await this.paymentReceivedMail.getMailOptions(paymentId);

    const transformed = await this.transformer.transform(
      paymentReceive,
      new GetPaymentReceivedMailStateTransformer(),
      {
        mailOptions,
      },
    );
    return transformed;
  };
}
