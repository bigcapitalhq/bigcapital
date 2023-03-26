import { Container, Inject } from 'typedi';
import AuthenticationService from '@/services/Authentication';

export default class WelcomeEmailJob {
  /**
   * Constructor method.
   * @param {Agenda} agenda 
   */
  constructor(agenda) {
    agenda.define(
      'reset-password-mail',
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
    const { data } = job.attrs;
    const { user, token } = data;
    const Logger = Container.get('logger');
    const authService = Container.get(AuthenticationService);

    Logger.info(`[send_reset_password] started.`, { data });
  
    try {
      await authService.mailMessages.sendResetPasswordMessage(user, token);
      Logger.info(`[send_reset_password] finished.`, { data });
      done()
    } catch (error) {
      Logger.error(`[send_reset_password] error.`, { data, error });
      done(error);
    }
  }
}
