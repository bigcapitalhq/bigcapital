import Container, { Service } from 'typedi';
import { SendSaleEstimateMail } from './SendSaleEstimateMail';

@Service()
export class SendSaleEstimateMailJob {
  /**
   * Constructor method.
   */
  constructor(agenda) {
    agenda.define(
      'sale-estimate-mail-send',
      { priority: 'high', concurrency: 2 },
      this.handler
    );
  }

  /**
   * Triggers sending invoice mail.
   */
  private handler = async (job, done: Function) => {
    const { tenantId, saleEstimateId, messageOptions } = job.attrs.data;
    const sendSaleEstimateMail = Container.get(SendSaleEstimateMail);

    try {
      await sendSaleEstimateMail.sendMail(
        tenantId,
        saleEstimateId,
        messageOptions
      );
      done();
    } catch (error) {
      console.log(error);
      done(error);
    }
  };
}
