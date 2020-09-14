import Container from 'typedi';
import SubscriptionService from 'services/Subscription/Subscription';

export default class MailNotificationSubscribeEnd {
  /**
   * Job handler.
   * @param {Job} job -
   */
  handler(job) {
    const { tenantId, phoneNumber, remainingDays } = job.attrs.data;

    const subscriptionService = Container.get(SubscriptionService);
    const Logger = Container.get('logger');

    Logger.info(`Send mail notification subscription end soon - started: ${job.attrs.data}`);

    try {
      subscriptionService.mailMessages.sendRemainingTrialPeriod(
        phoneNumber, remainingDays,
      );
      Logger.info(`Send mail notification subscription end soon - finished: ${job.attrs.data}`);
    } catch(error) {
      Logger.info(`Send mail notification subscription end soon - failed: ${job.attrs.data}, error: ${e}`);
      done(e);
    }
  }
}
