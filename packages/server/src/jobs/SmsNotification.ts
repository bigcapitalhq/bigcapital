import { Container } from 'typedi';

export default class SmsNotification {
  constructor(agenda) {
    agenda.define('sms-notification', { priority: 'high' }, this.handler);
  }

  /**
   *
   * @param {Job}job
   */
  async handler(job) {
    const { message, to } = job.attrs.data;
    const smsClient = Container.get('SMSClient');

    try {
      await smsClient.sendMessage(to, message);
    } catch (error) {
      done(e);
    }
  }
}
