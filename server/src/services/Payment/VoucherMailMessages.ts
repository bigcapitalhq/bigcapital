import fs from 'fs';
import path from 'path';
import Mustache from 'mustache';
import { Container } from 'typedi';

export default class SubscriptionMailMessages {
  /**
   * Send voucher code to the given mail address.
   * @param {string} voucherCode 
   * @param {email} email 
   */
  public async sendMailVoucher(voucherCode: string, email: string) {
    const Logger = Container.get('logger');
    const Mail = Container.get('mail');

    const filePath = path.join(global.rootPath, 'views/mail/VoucherReceive.html');
    const template = fs.readFileSync(filePath, 'utf8');
    const rendered = Mustache.render(template, { voucherCode });

    const mailOptions = {
      to: email,
      from: `${process.env.MAIL_FROM_NAME} ${process.env.MAIL_FROM_ADDRESS}`,
      subject: 'Bigcapital Voucher',
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