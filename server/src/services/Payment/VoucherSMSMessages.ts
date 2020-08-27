import { Container, Inject } from 'typedi';
import SMSClient from '@/services/SMSClient';

export default class SubscriptionSMSMessages {
  @Inject('SMSClient')
  smsClient: SMSClient;

  /**
   * Sends voucher code to the given phone number via SMS message.
   * @param {string} phoneNumber 
   * @param {string} voucherCode 
   */
  public async sendVoucherSMSMessage(phoneNumber: string, voucherCode: string) {
    const message: string = `Your voucher card number: ${voucherCode}.`;
    return this.smsClient.sendMessage(phoneNumber, message);
  }
}