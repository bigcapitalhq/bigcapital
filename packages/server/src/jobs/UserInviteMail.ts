import { Container, Inject } from 'typedi';
import InviteUserService from '@/services/InviteUsers/AcceptInviteUser';
import SendInviteUsersMailMessage from '@/services/InviteUsers/SendInviteUsersMailMessage';

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
    const sendInviteMailMessage = Container.get(SendInviteUsersMailMessage);

    try {
      await sendInviteMailMessage.sendInviteMail(
        tenantId,
        authorizedUser,
        invite
      );
      done();
    } catch (error) {
      console.log(error);
      done(error);
    }
  }
}
