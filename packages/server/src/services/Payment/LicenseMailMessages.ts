import { Container } from 'typedi';
import Mail from '@/lib/Mail';
import config from '@/config';
export default class SubscriptionMailMessages {
  /**
   * Send license code to the given mail address.
   * @param {string} licenseCode 
   * @param {email} email 
   */
  public async sendMailLicense(licenseCode: string, email: string) {
    const Logger = Container.get('logger');
    
    const mail = new Mail()
      .setView('mail/LicenseReceive.html')
      .setSubject('Bigcapital - License code')
      .setTo(email)
      .setData({
        licenseCode,
        successEmail: config.customerSuccess.email,
        successPhoneNumber: config.customerSuccess.phoneNumber,
      });
    
    await mail.send();
    Logger.info('[license_mail] sent successfully.');
  }
}