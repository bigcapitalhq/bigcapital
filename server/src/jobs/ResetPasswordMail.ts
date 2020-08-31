import fs from 'fs';
import path from 'path';
import Mustache from 'mustache';
import { Container } from 'typedi';

export default class ResetPasswordMailJob {
  /**
   * 
   * @param job 
   * @param done 
   */
  handler(job, done) {
    const { user, token } = job.attrs.data;

    const Logger = Container.get('logger');
    const Mail = Container.get('mail');

    const filePath = path.join(global.rootPath, 'views/mail/ResetPassword.html');
    const template = fs.readFileSync(filePath, 'utf8');
    const rendered = Mustache.render(template, {
      url: `https://google.com/reset/${token}`,
      first_name: user.firstName,
      last_name: user.lastName,
      // contact_us_email: config.contactUsMail,
    });

    const mailOptions = {
      to: user.email,
      from: `${process.env.MAIL_FROM_NAME} ${process.env.MAIL_FROM_ADDRESS}`,
      subject: 'Bigcapital - Password Reset',
      html: rendered,
    };
    Mail.sendMail(mailOptions, (error) => {
      if (error) {
        Logger.info('[send_reset_password] failed send reset password mail', { error, user });
        done(error);
        return;
      }
      Logger.info('[send_reset_password] user has been sent reset password email successfuly.', { user });
      done();
    });
    res.status(200).send({ email: passwordReset.email });
  }
}