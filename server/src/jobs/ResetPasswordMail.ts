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
    const { user, token } = job.attrs.data;
    const Logger = Container.get('logger');
    const authService = Container.get(AuthenticationService);

    Logger.info(`[send_reset_password] started: ${job.attrs.data}`);
  
    try {
      await authService.mailMessages.sendResetPasswordMessage(user, token);
      Logger.info(`[send_reset_password] finished: ${job.attrs.data}`);
      done()
    } catch (error) {
      Logger.info(`[send_reset_password] error: ${job.attrs.data}, error: ${error}`);
      done(error);
    }
  }
}
