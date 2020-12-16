import { Container, Inject } from 'typedi';
import SMSClient from 'services/SMSClient';

export default class SubscriptionSMSMessages {
  @Inject('SMSClient')
  smsClient: SMSClient;

  /**
   * Sends license code to the given phone number via SMS message.
   * @param {string} phoneNumber 
   * @param {string} licenseCode 
   */
  public async sendLicenseSMSMessage(phoneNumber: string, licenseCode: string) {
    const message: string = `Your license card number: ${licenseCode}. If you need any help please contact us. Bigcapital.`;
    return this.smsClient.sendMessage(phoneNumber, message);
  }
}