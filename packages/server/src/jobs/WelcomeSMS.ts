import { Container, Inject } from 'typedi';
import AuthenticationService from '@/services/Authentication/AuthApplication';

export default class WelcomeSMSJob {
  /**
   * Constructor method.
   * @param {Agenda} agenda 
   */
  constructor(agenda) {
    agenda.define('welcome-sms', { priority: 'high' }, this.handler);
  }

  /**
   * Handle send welcome mail job.
   * @param {Job} job 
   * @param {Function} done 
   */
  public async handler(job, done: Function): Promise<void> {
    const { tenant, user } = job.attrs.data;

    const Logger = Container.get('logger');
    const authService = Container.get(AuthenticationService);

    Logger.info(`[welcome_sms] started: ${job.attrs.data}`);

    try {
      await authService.smsMessages.sendWelcomeMessage(tenant, user);
      Logger.info(`[welcome_sms] finished`, { tenant, user });
      done();
    } catch (error) {
      Logger.info(`[welcome_sms] error`, { error, tenant, user });
      done(error);
    }
  }
}
