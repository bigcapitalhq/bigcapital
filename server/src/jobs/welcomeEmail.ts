import { Container, Inject } from 'typedi';
import AuthenticationService from '@/services/Authentication';

export default class WelcomeEmailJob {
  /**
   * Constructor method.
   * @param {Agenda} agenda - 
   */
  constructor(agenda) {
    // Welcome mail and SMS message.
    agenda.define(
      'welcome-email',
      { priority: 'high' },
      this.handler.bind(this),
    );
  }

  /**
   * Handle send welcome mail job.
   * @param {Job} job 
   * @param {Function} done 
   */
  public async handler(job, done: Function): Promise<void> {
    const { organizationName, user } = job.attrs.data;
    const Logger = Container.get('logger');
    const authService = Container.get(AuthenticationService);

    Logger.info(`[welcome_mail] send welcome mail message - started: ${job.attrs.data}`);

    try {
      await authService.mailMessages.sendWelcomeMessage(user, organizationName);
      Logger.info(`[welcome_mail] send welcome mail message - finished: ${job.attrs.data}`);
      done();
    } catch (error) {
      Logger.info(`[welcome_mail] send welcome mail message - error: ${job.attrs.data}, error: ${error}`);
      done(error);
    }
  }
}
