import fs from 'fs';
import { Service, Container } from "typedi";
import Mustache from 'mustache';
import path from 'path';
import { ISystemUser } from '@/interfaces';
import config from '@/../config/config';

@Service()
export default class AuthenticationMailMesssages {
  /**
   * Sends welcome message.
   * @param {ISystemUser} user - The system user.
   * @param {string} organizationName - 
   * @return {Promise<void>}
   */
  sendWelcomeMessage(user: ISystemUser, organizationName: string): Promise<void> {
    const Mail = Container.get('mail');
    
    const filePath = path.join(global.rootPath, 'views/mail/Welcome.html');
    const template = fs.readFileSync(filePath, 'utf8');
    const rendered = Mustache.render(template, {
      email: user.email,
      firstName: user.firstName,
      organizationName,
    });
    const mailOptions = {
      to: user.email,
      from: `${process.env.MAIL_FROM_NAME} ${process.env.MAIL_FROM_ADDRESS}`,
      subject: 'Welcome to Bigcapital',
      html: rendered,
    };
    return new Promise((resolve, reject) => {
      Mail.sendMail(mailOptions, (error) => {
        if (error) {
          resolve(error);
          return;
        }
        reject();
      });
    });
  }

  /**
   * Sends reset password message.
   * 
   * @param {ISystemUser} user - The system user.
   * @param {string} token - Reset password token.
   * @return {Promise<void>}
   */
  sendResetPasswordMessage(user: ISystemUser, token: string): Promise<void> {
    const Mail = Container.get('mail');

    const filePath = path.join(global.rootPath, 'views/mail/ResetPassword.html');
    const template = fs.readFileSync(filePath, 'utf8');
    const rendered = Mustache.render(template, {
      resetPasswordUrl: `${config.baseURL}/reset/${token}`,
      first_name: user.firstName,
      last_name: user.lastName,
      contact_us_email: config.contactUsMail,
    });
    const mailOptions = {
      to: user.email,
      from: `${process.env.MAIL_FROM_NAME} ${process.env.MAIL_FROM_ADDRESS}`,
      subject: 'Bigcapital - Password Reset',
      html: rendered,
    };
    return new Promise((resolve, reject) => {
      Mail.sendMail(mailOptions, (error) => {
        if (error) {
          reject(error);
          return;
        }
        resolve();
      });
    });
  }
}