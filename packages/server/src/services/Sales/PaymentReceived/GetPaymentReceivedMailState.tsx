import { PaymentReceiveMailOpts } from '@/interfaces';
import HasTenancyService from '@/services/Tenancy/TenancyService';
import { GetPaymentReceivedMailStateTransformer } from './GetPaymentReceivedMailStateTransformer';
import { TransformerInjectable } from '@/lib/Transformer/TransformerInjectable';
import { Inject, Service } from 'typedi';
import { ContactMailNotification } from '@/services/MailNotification/ContactMailNotification';

@Service()
export class GetPaymentReceivedMailState {
  @Inject()
  private tenancy: HasTenancyService;

  @Inject()
  private contactMailNotification: ContactMailNotification;

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

    const mailOptions =
      await this.contactMailNotification.getDefaultMailOptions(
        tenantId,
        paymentReceive.customerId
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
