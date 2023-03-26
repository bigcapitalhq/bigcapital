import { ISystemUser } from '@/interfaces';
import TenancyService from '@/services/Tenancy/TenancyService';
import Mail from '@/lib/Mail';
import { Service, Container } from 'typedi';
import config from '@/config';
import { Tenant } from '@/system/models';

@Service()
export default class InviteUsersMailMessages {
  /**
   * Sends invite mail to the given email.
   * @param user
   * @param invite
   */
  async sendInviteMail(tenantId: number, fromUser: ISystemUser, invite: any) {
    // Retreive tenant orgnaization name.
    const tenant = await Tenant.query()
      .findById(tenantId)
      .withGraphFetched('metadata');

    const root = __dirname + '/../../../views/images/bigcapital.png';

    const mail = new Mail()
      .setSubject(`${fromUser.firstName} has invited you to join a Bigcapital`)
      .setView('mail/UserInvite.html')
      .setTo(invite.email)
      .setAttachments([
        {
          filename: 'bigcapital.png',
          path: root,
          cid: 'bigcapital_logo',
        },
      ])
      .setData({
        root,
        acceptUrl: `${config.baseURL}/auth/invite/${invite.token}/accept`,
        fullName: `${fromUser.firstName} ${fromUser.lastName}`,
        firstName: fromUser.firstName,
        lastName: fromUser.lastName,
        email: fromUser.email,
        organizationName: tenant.metadata.name,
      });

    await mail.send();
  }
}
