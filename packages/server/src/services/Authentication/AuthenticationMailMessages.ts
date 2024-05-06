import { Service } from 'typedi';
import { ISystemUser } from '@/interfaces';
import config from '@/config';
import Mail from '@/lib/Mail';

@Service()
export default class AuthenticationMailMesssages {
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

  /**
   * Sends signup verification mail.
   * @param {string} email - Email address
   * @param {string} fullName - User name.
   * @param {string} token - Verification token.
   * @returns {Promise<void>}
   */
  public async sendSignupVerificationMail(
    email: string,
    fullName: string,
    token: string
  ) {
    const verifyUrl = `${config.baseURL}/auth/email_confirmation?token=${token}&email=${email}`;

    await new Mail()
      .setSubject('Bigcapital - Verify your email')
      .setView('mail/SignupVerifyEmail.html')
      .setTo(email)
      .setAttachments([
        {
          filename: 'bigcapital.png',
          path: `${global.__views_dir}/images/bigcapital.png`,
          cid: 'bigcapital_logo',
        },
      ])
      .setData({ verifyUrl, fullName })
      .send();
  }
}
