import { Service } from "typedi";

@Service()
export default class InviteUsersMailMessages {

  sendInviteMail() {
    const filePath = path.join(global.__root, 'views/mail/UserInvite.html');
    const template = fs.readFileSync(filePath, 'utf8');

    const rendered = Mustache.render(template, {
      acceptUrl: `${req.protocol}://${req.hostname}/invite/accept/${invite.token}`,
      fullName: `${user.firstName} ${user.lastName}`,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      organizationName: organizationOptions.getMeta('organization_name'),
    });
    const mailOptions = {
      to: user.email,
      from: `${process.env.MAIL_FROM_NAME} ${process.env.MAIL_FROM_ADDRESS}`,
      subject: `${user.fullName} has invited you to join a Bigcapital`,
      html: rendered,
    };
    mail.sendMail(mailOptions, (error) => {
      if (error) {
        Logger.log('error', 'Failed send user invite mail', { error, form });
      }
      Logger.log('info', 'User has been sent invite user email successfuly.', { form });
    });
  }
}