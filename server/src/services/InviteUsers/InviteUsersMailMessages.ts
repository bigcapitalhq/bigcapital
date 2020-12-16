import { IInviteUserInput, ISystemUser } from "interfaces";
import Mail from "lib/Mail";
import { Service } from "typedi";

@Service()
export default class InviteUsersMailMessages {

  /**
   * Sends invite mail to the given email.
   * @param user 
   * @param invite 
   */
  async sendInviteMail(user: ISystemUser, invite) {
    const mail = new Mail()
      .setSubject(`${user.fullName} has invited you to join a Bigcapital`)
      .setView('mail/UserInvite.html')
      .setData({
        acceptUrl: `${req.protocol}://${req.hostname}/invite/accept/${invite.token}`,
        fullName: `${user.firstName} ${user.lastName}`,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        organizationName: organizationOptions.getMeta('organization_name'),
      });
    
    await mail.send();
    Logger.log('info', 'User has been sent invite user email successfuly.');
  }
}