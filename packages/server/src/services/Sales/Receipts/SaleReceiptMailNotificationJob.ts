import Container, { Service } from 'typedi';
import { SaleReceiptMailNotification } from './SaleReceiptMailNotification';

@Service()
export class SaleReceiptMailNotificationJob {
  /**
   * Constructor method.
   */
  constructor(agenda) {
    agenda.define(
      'sale-receipt-mail-send',
      { priority: 'high', concurrency: 2 },
      this.handler
    );
  }

  /**
   * Triggers sending invoice mail.
   */
  private handler = async (job, done: Function) => {
    const { tenantId, saleReceiptId, messageOpts } = job.attrs.data;
    const receiveMailNotification = Container.get(SaleReceiptMailNotification);

    try {
      await receiveMailNotification.sendMail(
        tenantId,
        saleReceiptId,
        messageOpts
      );
      done();
    } catch (error) {
      console.log(error);
      done(error);
    }
  };
}
