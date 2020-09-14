import { Service, Inject } from 'typedi';
import SMSClient from 'services/SMSClient';

@Service()
export default class SubscriptionSMSMessages {
  @Inject('SMSClient')
  smsClient: SMSClient;

  public async sendRemainingSubscriptionPeriod(phoneNumber: string, remainingDays: number) {
    const message: string = `
      Your remaining subscription is ${remainingDays} days,
      please renew your subscription before expire.
    `;
    this.smsClient.sendMessage(phoneNumber, message);
  }

  public async sendRemainingTrialPeriod(phoneNumber: string, remainingDays: number) {
    const message: string = `
      Your remaining free trial is ${remainingDays} days,
      please subscription before ends, if you have any quation to contact us.`;

    this.smsClient.sendMessage(phoneNumber, message);
  }
}