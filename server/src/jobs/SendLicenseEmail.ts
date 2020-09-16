import { Container } from 'typedi';
import LicenseService from 'services/Payment/License';

export default class SendLicenseViaEmailJob {
  public async handler(job, done: Function): Promise<void> {
    const Logger = Container.get('logger');
    const licenseService = Container.get(LicenseService);
    const { email, licenseCode } = job.attrs.data;

    Logger.debug(`Send license via email - started: ${job.attrs.data}`);

    try {
      await licenseService.mailMessages.sendMailLicense(licenseCode, email);
      Logger.debug(`Send license via email - completed: ${job.attrs.data}`);
      done();
    } catch(e) {
      Logger.error(`Send license via email: ${job.attrs.data}, error: ${e}`);
      done(e);  
    } 
  }
}
