import { Container } from 'typedi';
import AuthenticationService from 'services/Authentication';

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
    const { organizationId, user } = job.attrs.data;
    const Logger: any = Container.get('logger');
    const authService = Container.get(AuthenticationService);

    Logger.info(`[welcome_mail] started: ${job.attrs.data}`);

    try {
      await authService.mailMessages.sendWelcomeMessage(user, organizationId);
      Logger.info(`[welcome_mail] finished: ${job.attrs.data}`);
      done();
    } catch (error) {
      Logger.error(`[welcome_mail] error: ${job.attrs.data}, error: ${error}`);
      done(error);
    }
  }
}
