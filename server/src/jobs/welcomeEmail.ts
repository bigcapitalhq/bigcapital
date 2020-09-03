import { Container, Inject } from 'typedi';
import AuthenticationService from '@/services/Authentication';

export default class WelcomeEmailJob {
  @Inject()
  authService: AuthenticationService;

  /**
   * Handle send welcome mail job.
   * @param {Job} job 
   * @param {Function} done 
   */
  public async handler(job, done: Function): Promise<void> {
    const { email, organizationName, firstName } = job.attrs.data;
    const Logger = Container.get('logger');

    Logger.info(`Send welcome mail message - started: ${job.attrs.data}`);
  
    try {
      await this.authService.mailMessages.sendWelcomeMessage();
      Logger.info(`Send welcome mail message - finished: ${job.attrs.data}`);
      done()
    } catch (error) {
      Logger.info(`Send welcome mail message - error: ${job.attrs.data}, error: ${error}`);
      done(error);
    }
  }
}
