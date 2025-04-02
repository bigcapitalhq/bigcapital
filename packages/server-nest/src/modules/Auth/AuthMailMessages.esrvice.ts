import { Injectable } from '@nestjs/common';
import * as path from 'path';
import { SystemUser } from '../System/models/SystemUser';
import { ModelObject } from 'objection';
import { ConfigService } from '@nestjs/config';
import { Mail } from '../Mail/Mail';
import { MailTransporter } from '../Mail/MailTransporter.service';

@Injectable()
export class AuthenticationMailMesssages {
  constructor(
    private readonly configService: ConfigService,
    private readonly mailTransporter: MailTransporter,
  ) {}

  /**
   * Sends reset password message.
   * @param {ISystemUser} user - The system user.
   * @param {string} token - Reset password token.
   * @returns {Mail}
   */
  resetPasswordMessage(user: ModelObject<SystemUser>, token: string) {
    const baseURL = this.configService.get('baseURL');

    return new Mail()
      .setSubject('Bigcapital - Password Reset')
      .setView('mail/ResetPassword.html')
      .setTo(user.email)
      .setAttachments([
        {
          filename: 'bigcapital.png',
          path: path.join(global.__static_dirname, `/images/bigcapital.png`),
          cid: 'bigcapital_logo',
        },
      ])
      .setData({
        resetPasswordUrl: `${baseURL}/auth/reset_password/${token}`,
        first_name: user.firstName,
        last_name: user.lastName,
      });
  }

  sendResetPasswordMail(user: ModelObject<SystemUser>, token: string) {
      const mail = this.resetPasswordMessage(user, token);

      return this.mailTransporter.send(mail);
  }

  /**
   * Sends signup verification mail.
   * @param {string} email - Email address
   * @param {string} fullName - User name.
   * @param {string} token - Verification token.
   * @returns {Mail}
   */
  signupVerificationMail(email: string, fullName: string, token: string) {
    const baseURL = this.configService.get('baseURL');
    const verifyUrl = `${baseURL}/auth/email_confirmation?token=${token}&email=${email}`;

    return new Mail()
      .setSubject('Bigcapital - Verify your email')
      .setView('mail/SignupVerifyEmail.html')
      .setTo(email)
      .setAttachments([
        {
          filename: 'bigcapital.png',
          path: path.join(global.__static_dirname, `/images/bigcapital.png`),
          cid: 'bigcapital_logo',
        },
      ])
      .setData({ verifyUrl, fullName });
  }

  sendSignupVerificationMail(email: string, fullName: string, token: string) {
    const mail = this.signupVerificationMail(
      email,
      fullName,
      token,
    );
    return this.mailTransporter.send(mail);
  }
}
