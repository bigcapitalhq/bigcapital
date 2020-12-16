import fs from 'fs';
import Mustache from 'mustache';
import { Container } from 'typedi';
import path from 'path';
import { IMailable } from 'interfaces';

export default class Mail{
  view: string;
  subject: string;
  to: string;
  from: string = `${process.env.MAIL_FROM_NAME} ${process.env.MAIL_FROM_ADDRESS}`;
  data: { [key: string]: string | number };

  /**
   * Mail options.
   */
  private get mailOptions() {
    return {
      to: this.to,
      from: this.from,
      subject: this.subject,
      html: this.render(this.data),
    };
  }

  /**
   * Sends the given mail to the target address.
   */
  public send() {
    return new Promise((resolve, reject) => {
      const Mail = Container.get('mail');

      Mail.sendMail(this.mailOptions, (error) => {
        if (error) {
          reject(error);
          return;
        }
        resolve(true);
      });
    });
  }

  /**
   * Set send mail to address.
   * @param {string} to -
   */
  setTo(to: string) {
    this.to = to;
    return this;
  }

  /**
   * Sets from address to the mail.
   * @param {string} from 
   * @return {}
   */
  private setFrom(from: string) {
    this.from = from;
    return this;
  }

  /**
   * Set mail subject.
   * @param {string} subject 
   */
  setSubject(subject: string) {
    this.subject = subject;
    return this;
  }

  /**
   * Set view directory.
   * @param {string} view 
   */
  setView(view: string) {
    this.view = view;
    return this;
  }

  setData(data) {
    this.data = data;
    return this;
  }

  /**
   * Renders the view template with the given data.
   * @param  {object} data 
   * @return {string}
   */
  render(data): string {
    const viewContent = this.getViewContent();
    return Mustache.render(viewContent, data);
  }

  /**
   * Retrieve view content from the view directory.
   */
  private getViewContent(): string {
    const filePath = path.join(global.__root, `../views/${this.view}`);
    return fs.readFileSync(filePath, 'utf8');
  }
}