import { Service } from "typedi";

@Service()
export default class SubscriptionMailMessages {
  /**
   * 
   * @param phoneNumber 
   * @param remainingDays 
   */
  public async sendRemainingSubscriptionPeriod(phoneNumber: string, remainingDays: number) {
    const message: string = `
      Your remaining subscription is ${remainingDays} days,
      please renew your subscription before expire.
    `;
    this.smsClient.sendMessage(phoneNumber, message);
  }

  /**
   * 
   * @param phoneNumber 
   * @param remainingDays 
   */
  public async sendRemainingTrialPeriod(phoneNumber: string, remainingDays: number) {
    const message: string = `
      Your remaining free trial is ${remainingDays} days,
      please subscription before ends, if you have any quation to contact us.`;

    this.smsClient.sendMessage(phoneNumber, message);
  }
}