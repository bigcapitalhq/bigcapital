import { Container } from 'typedi';
import LicenseService from '@/services/Payment/License';

export default class SendLicenseViaPhoneJob {
  /**
   * Constructor method.
   */
  constructor(agenda) {
    agenda.define(
      'send-license-via-phone',
      { priority: 'high', concurrency: 1, },
      this.handler,
    );
  }

  public async handler(job, done: Function): Promise<void> {
    const { phoneNumber, licenseCode } = job.attrs.data;

    const Logger = Container.get('logger');
    const licenseService = Container.get(LicenseService);

    Logger.debug(`Send license via phone number - started: ${job.attrs.data}`);

    try {
      await licenseService.smsMessages.sendLicenseSMSMessage(phoneNumber, licenseCode);
      Logger.debug(`Send license via phone number - completed: ${job.attrs.data}`);
      done();
    } catch(e) {
      Logger.error(`Send license via phone number: ${job.attrs.data}, error: ${e}`);
      done(e);  
    }
  }
}
