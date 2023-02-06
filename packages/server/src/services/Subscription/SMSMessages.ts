import { Service, Inject } from 'typedi';
import SMSClient from '@/services/SMSClient';

@Service()
export default class SubscriptionSMSMessages {
  @Inject('SMSClient')
  smsClient: SMSClient;

  /**
   * Send remaining subscription period SMS message.
   * @param {string} phoneNumber -
   * @param {number} remainingDays -
   */
  public async sendRemainingSubscriptionPeriod(
    phoneNumber: string,
    remainingDays: number
  ): Promise<void> {
    const message: string = `
      Your remaining subscription is ${remainingDays} days,
      please renew your subscription before expire.
    `;
    this.smsClient.sendMessage(phoneNumber, message);
  }

  /**
   * Send remaining trial period SMS message.
   * @param {string} phoneNumber -
   * @param {number} remainingDays -
   */
  public async sendRemainingTrialPeriod(
    phoneNumber: string,
    remainingDays: number
  ): Promise<void> {
    const message: string = `
      Your remaining free trial is ${remainingDays} days,
      please subscription before ends, if you have any quation to contact us.`;

    this.smsClient.sendMessage(phoneNumber, message);
  }
}
