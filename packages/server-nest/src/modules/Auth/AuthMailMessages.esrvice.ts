import { Injectable } from '@nestjs/common';
import { SystemUser } from '../System/models/SystemUser';
import { ModelObject } from 'objection';
import { ConfigService } from '@nestjs/config';
import { Mail } from '../Mail/Mail';

@Injectable()
export class AuthenticationMailMesssages {
  constructor(private readonly configService: ConfigService) {}
  /**
   * Sends reset password message.
   * @param {ISystemUser} user - The system user.
   * @param {string} token - Reset password token.
   * @returns {Mail}
   */
  sendResetPasswordMessage(user: ModelObject<SystemUser>, token: string) {
    const baseURL = this.configService.get('baseURL');

    return new Mail()
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
        resetPasswordUrl: `${baseURL}/auth/reset_password/${token}`,
        first_name: user.firstName,
        last_name: user.lastName,
      });
  }

  /**
   * Sends signup verification mail.
   * @param {string} email - Email address
   * @param {string} fullName - User name.
   * @param {string} token - Verification token.
   * @returns {Mail}
   */
  sendSignupVerificationMail(email: string, fullName: string, token: string) {
    const baseURL = this.configService.get('baseURL');
    const verifyUrl = `${baseURL}/auth/email_confirmation?token=${token}&email=${email}`;

    return new Mail()
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
      .setData({ verifyUrl, fullName });
  }
}
