import { Container, Inject } from 'typedi';
import InviteUserService from 'services/InviteUsers';

export default class UserInviteMailJob {
  /**
   * Constructor method.
   * @param {Agenda} agenda
   */
  constructor(agenda) {
    agenda.define(
      'user-invite-mail',
      { priority: 'high' },
      this.handler.bind(this)
    );
  }

  /**
   * Handle invite user job.
   * @param {Job} job
   * @param {Function} done
   */
  public async handler(job, done: Function): Promise<void> {
    const { invite, authorizedUser, tenantId } = job.attrs.data;

    const Logger = Container.get('logger');
    const inviteUsersService = Container.get(InviteUserService);

    Logger.info(`Send invite user mail - started: ${job.attrs.data}`);

    try {
      await inviteUsersService.mailMessages.sendInviteMail(
        tenantId,
        authorizedUser,
        invite
      );
      Logger.info(`Send invite user mail - finished: ${job.attrs.data}`);
      done();
    } catch (error) {
      Logger.info(
        `Send invite user mail - error: ${job.attrs.data}, error: ${error}`
      );
      done(error);
    }
  }
}
