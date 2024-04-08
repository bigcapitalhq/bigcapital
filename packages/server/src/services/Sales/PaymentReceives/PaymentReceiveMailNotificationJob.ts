import Container, { Service } from 'typedi';
import { SendPaymentReceiveMailNotification } from './PaymentReceiveMailNotification';

@Service()
export class PaymentReceiveMailNotificationJob {
  /**
   * Constructor method.
   */
  constructor(agenda) {
    agenda.define('payment-receive-mail-send', { priority: 'high', concurrency: 2 }, this.handler);
  }

  /**
   * Triggers sending payment notification via mail.
   */
  private handler = async (job, done: Function) => {
    const { tenantId, paymentReceiveId, messageDTO } = job.attrs.data;
    const paymentMail = Container.get(SendPaymentReceiveMailNotification);

    try {
      await paymentMail.sendMail(tenantId, paymentReceiveId, messageDTO);
      done();
    } catch (error) {
      console.log(error);
      done(error);
    }
  };
}
