import Container, { Service } from 'typedi';
import events from '@/subscribers/events';
import { SendSaleInvoiceMail } from './SendSaleInvoiceMail';

@Service()
export class SendSaleInvoiceMailJob {
  /**
   * Constructor method.
   */
  constructor(agenda) {
    agenda.define(
      'sale-invoice-mail-send',
      { priority: 'high', concurrency: 2 },
      this.handler
    );
  }

  /**
   * Triggers sending invoice mail.
   */
  private handler = async (job, done: Function) => {
    const { tenantId, saleInvoiceId, messageDTO } = job.attrs.data;
    const sendInvoiceMail = Container.get(SendSaleInvoiceMail);

    try {
      await sendInvoiceMail.sendMail(tenantId, saleInvoiceId, messageDTO);
      done();
    } catch (error) {
      console.log(error);
      done(error);
    }
  };
}
