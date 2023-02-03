import { Container } from 'typedi';
import LicenseService from '@/services/Payment/License';

export default class SendLicenseViaEmailJob {
  /**
   * Constructor method.
   * @param agenda 
   */
  constructor(agenda) {
    agenda.define(
      'send-license-via-email',
      { priority: 'high', concurrency: 1, },
      this.handler,
    );
  }

  public async handler(job, done: Function): Promise<void> {
    const Logger = Container.get('logger');
    const licenseService = Container.get(LicenseService);
    const { email, licenseCode } = job.attrs.data;

    Logger.info(`[send_license_via_mail] started: ${job.attrs.data}`);

    try {
      await licenseService.mailMessages.sendMailLicense(licenseCode, email);
      Logger.info(`[send_license_via_mail] completed: ${job.attrs.data}`);
      done();
    } catch(e) {
      Logger.error(`[send_license_via_mail] ${job.attrs.data}, error: ${e}`);
      done(e);  
    } 
  }
}
