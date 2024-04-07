import config from '@/config';
import { ISystemUser } from '@/interfaces';
import Mail from '@/lib/Mail';
import { Service } from 'typedi';

@Service()
export default class AuthenticationMailMesssages {
  /**
   * Sends reset password message.
   * @param {ISystemUser} user - The system user.
   * @param {string} token - Reset password token.
   * @return {Promise<void>}
   */
  public async sendResetPasswordMessage(user: ISystemUser, token: string): Promise<void> {
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
