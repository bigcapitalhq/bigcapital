import fs from 'fs';
import Mustache from 'mustache';
import path from 'path';
import { Container } from 'typedi';

export default class WelcomeEmailJob {
  /**
   * 
   * @param {Job} job 
   * @param {Function} done 
   */
  public async handler(job, done: Function): Promise<void> {
    const { email, organizationName, firstName } = job.attrs.data;
    const Logger = Container.get('logger');
    const Mail = Container.get('mail');

    const filePath = path.join(global.rootPath, 'views/mail/Welcome.html');
    const template = fs.readFileSync(filePath, 'utf8');
    const rendered = Mustache.render(template, {
      email, organizationName, firstName,
    });
    const mailOptions = {
      to: email,
      from: `${process.env.MAIL_FROM_NAME} ${process.env.MAIL_FROM_ADDRESS}`,
      subject: 'Welcome to Bigcapital',
      html: rendered,
    };
    Mail.sendMail(mailOptions, (error) => {
      if (error) {
        Logger.error('Failed send welcome mail', { error, form });
        done(error);
        return;
      }
      Logger.info('User has been sent welcome email successfuly.', { form });
      done();
    });
  }
}
