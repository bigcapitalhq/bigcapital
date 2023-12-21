import Container, { Service } from 'typedi';
import { SendInvoiceMailReminder } from './SendSaleInvoiceMailReminder';

@Service()
export class SendSaleInvoiceReminderMailJob {
  /**
   * Constructor method.
   */
  constructor(agenda) {
    agenda.define(
      'sale-invoice-reminder-mail-send',
      { priority: 'high', concurrency: 1 },
      this.handler
    );
  }

  /**
   * Triggers sending invoice mail.
   */
  private handler = async (job, done: Function) => {
    const { tenantId, saleInvoiceId, messageOptions } = job.attrs.data;
    const sendInvoiceMail = Container.get(SendInvoiceMailReminder);

    try {
      await sendInvoiceMail.sendMail(tenantId, saleInvoiceId, messageOptions);
      done();
    } catch (error) {
      console.log(error);
      done(error);
    }
  };
}
