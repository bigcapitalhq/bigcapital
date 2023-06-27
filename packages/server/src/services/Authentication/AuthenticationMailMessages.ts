import { Service } from 'typedi';
import { ISystemUser } from '@/interfaces';
import config from '@/config';
import Mail from '@/lib/Mail';

@Service()
export default class AuthenticationMailMessages {
  /**
   * Sends reset password message.
   * @param {ISystemUser} user - The system user.
   * @param {string} token - Reset password token.
   * @return {Promise<void>}
   */
  public async sendResetPasswordMessage(
    user: ISystemUser,
    token: string
  ): Promise<void> {
    await new Mail()
      .setSubject('Bigcapital - Password Reset')
      .setView('mail/ResetPassword.html')
      .setTo(user.email)
      .setAttachments([
        {
          filename: 'bigcapital.png',
          path: `${global.__views_dir}/images/bigcapital.png`,
          cid: 'bigcapital_logo',
        },
      ])
      .setData({
        resetPasswordUrl: `${config.baseURL}/auth/reset_password/${token}`,
        first_name: user.firstName,
        last_name: user.lastName,
      })
      .send();
  }
}
