import { Container, Inject } from 'typedi';
import AuthenticationService from '@/services/Authentication';

export default class WelcomeSMSJob {
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

    Logger.info(`Send welcome SMS message - started: ${job.attrs.data}`);
  
    try {
      await this.authService.smsMessages.sendWelcomeMessage();
      Logger.info(`Send welcome SMS message - finished: ${job.attrs.data}`);
      done()
    } catch (error) {
      Logger.info(`Send welcome SMS message - error: ${job.attrs.data}, error: ${error}`);
      done(error);
    }
  }
}
