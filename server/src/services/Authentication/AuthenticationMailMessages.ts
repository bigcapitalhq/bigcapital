
import { Service } from "typedi";
import { ISystemUser } from 'interfaces';
import config from 'config';
import Mail from "lib/Mail";

@Service()
export default class AuthenticationMailMesssages {
  /**
   * Sends welcome message.
   * @param {ISystemUser} user - The system user.
   * @param {string} organizationName - 
   * @return {Promise<void>}
   */
  async sendWelcomeMessage(
    user: ISystemUser,
    organizationId: string
  ): Promise<void> {

    const mail = new Mail()
      .setView('mail/Welcome.html')
      .setSubject('Welcome to Bigcapital')
      .setTo(user.email)
      .setData({
        firstName: user.firstName,
        organizationId,
        successPhoneNumber: config.customerSuccess.phoneNumber,
        successEmail: config.customerSuccess.email,
      });

    await mail.send();
  }

  /**
   * Sends reset password message.
   * @param {ISystemUser} user - The system user.
   * @param {string} token - Reset password token.
   * @return {Promise<void>}
   */
  async sendResetPasswordMessage(
    user: ISystemUser,
    token: string
  ): Promise<void> {

    const mail = new Mail()
      .setSubject('Bigcapital - Password Reset')
      .setView('mail/ResetPassword.html')
      .setTo(user.email)
      .setData({
        resetPasswordUrl: `${config.baseURL}/reset/${token}`,
        first_name: user.firstName,
        last_name: user.lastName,
        contact_us_email: config.contactUsMail,
      });
    
    await mail.send();
  }
}