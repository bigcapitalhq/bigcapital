import { PaymentReceiveMailOpts } from '@/interfaces';
import HasTenancyService from '@/services/Tenancy/TenancyService';
import { GetPaymentReceivedMailStateTransformer } from './GetPaymentReceivedMailStateTransformer';
import { TransformerInjectable } from '@/lib/Transformer/TransformerInjectable';
import { Inject, Service } from 'typedi';
import { SendPaymentReceiveMailNotification } from './PaymentReceivedMailNotification';

@Service()
export class GetPaymentReceivedMailState {
  @Inject()
  private tenancy: HasTenancyService;

  @Inject()
  private paymentReceivedMail: SendPaymentReceiveMailNotification;

  @Inject()
  private transformer: TransformerInjectable;

  /**
   * Retrieves the default payment mail options.
   * @param {number} tenantId - Tenant id.
   * @param {number} paymentReceiveId - Payment receive id.
   * @returns {Promise<PaymentReceiveMailOpts>}
   */
  public getMailOptions = async (
    tenantId: number,
    paymentId: number
  ): Promise<PaymentReceiveMailOpts> => {
    const { PaymentReceive } = this.tenancy.models(tenantId);

    const paymentReceive = await PaymentReceive.query()
      .findById(paymentId)
      .withGraphFetched('customer')
      .withGraphFetched('entries.invoice')
      .withGraphFetched('pdfTemplate')
      .throwIfNotFound();

    const mailOptions = await this.paymentReceivedMail.getMailOptions(
      tenantId,
      paymentId
    );
    const transformed = await this.transformer.transform(
      tenantId,
      paymentReceive,
      new GetPaymentReceivedMailStateTransformer(),
      {
        mailOptions,
      }
    );
    return transformed;
  };
}
