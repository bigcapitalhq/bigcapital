import { Container, Inject } from 'typedi';
import InviteUserService from '@/services/InviteUsers';

export default class UserInviteMailJob {
  @Inject()
  inviteUsersService: InviteUserService;

  /**
   * Handle invite user job.
   * @param {Job} job 
   * @param {Function} done 
   */
  public async handler(job, done: Function): Promise<void> {
    const { email, organizationName, firstName } = job.attrs.data;
    const Logger = Container.get('logger');

    Logger.info(`Send invite user mail - started: ${job.attrs.data}`);
  
    try {
      await this.inviteUsersService.mailMessages.sendInviteMail();
      Logger.info(`Send invite user mail - finished: ${job.attrs.data}`);
      done()
    } catch (error) {
      Logger.info(`Send invite user mail - error: ${job.attrs.data}, error: ${error}`);
      done(error);
    }
  }
}
