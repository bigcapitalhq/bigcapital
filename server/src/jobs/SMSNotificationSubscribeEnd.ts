import Container from 'typedi';
import SubscriptionService from '@/services/Subscription/Subscription';

export default class SMSNotificationSubscribeEnd {

  /**
   * 
   * @param {Job}job 
   */
  handler(job) {
    const { tenantId, phoneNumber, remainingDays } = job.attrs.data;

    const subscriptionService = Container.get(SubscriptionService);
    const Logger = Container.get('logger');

    Logger.debug(`Send SMS notification subscription end soon - started: ${job.attrs.data}`);

    try {
      subscriptionService.smsMessages.sendRemainingSubscriptionPeriod(
        phoneNumber, remainingDays,
      );
      Logger.debug(`Send SMS notification subscription end soon - finished: ${job.attrs.data}`);
    } catch(error) {
      Logger.error(`Send SMS notification subscription end soon - failed: ${job.attrs.data}, error: ${e}`);
      done(e);
    }
  }
}