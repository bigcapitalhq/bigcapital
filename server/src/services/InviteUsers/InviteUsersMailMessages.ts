import { ISystemUser } from 'interfaces';
import TenancyService from 'services/Tenancy/TenancyService';
import Mail from 'lib/Mail';
import { Service, Container } from 'typedi';
import config from 'config';

@Service()
export default class InviteUsersMailMessages {
  /**
   * Sends invite mail to the given email.
   * @param user
   * @param invite
   */
  async sendInviteMail(tenantId: number, fromUser: ISystemUser, invite: any) {
    const { protocol, hostname } = config;
    const tenancyService = Container.get(TenancyService);

    // Retrieve tenant's settings
    const settings = tenancyService.settings(tenantId);

    // Retreive tenant orgnaization name.
    const organizationName = settings.get({
      group: 'organization',
      key: 'name',
    });
    const mail = new Mail()
      .setSubject(`${fromUser.firstName} has invited you to join a Bigcapital`)
      .setView('mail/UserInvite.html')
      .setTo(invite.email)
      .setData({
        acceptUrl: `${protocol}://${hostname}/invite/accept/${invite.token}`,
        fullName: `${fromUser.firstName} ${fromUser.lastName}`,
        firstName: fromUser.firstName,
        lastName: fromUser.lastName,
        email: fromUser.email,
        organizationName,
      });

    await mail.send();
  }
}
