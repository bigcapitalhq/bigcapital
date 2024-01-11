import fs from 'fs';
import Mustache from 'mustache';
import { Container } from 'typedi';
import path from 'path';
import { IMailAttachment } from '@/interfaces';

export default class Mail {
  view: string;
  subject: string = '';
  content: string = '';
  to: string | string[];
  from: string = `${process.env.MAIL_FROM_NAME} ${process.env.MAIL_FROM_ADDRESS}`;
  data: { [key: string]: string | number };
  attachments: IMailAttachment[];

  /**
   * Mail options.
   */
  public get mailOptions() {
    return {
      to: this.to,
      from: this.from,
      subject: this.subject,
      html: this.html,
      attachments: this.attachments,
    };
  }

  /**
   * Retrieves the html content of the mail.
   * @returns {string}
   */
  public get html() {
    return this.view ? Mail.render(this.view, this.data) : this.content;
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
  setTo(to: string | string[]) {
    this.to = to;
    return this;
  }

  /**
   * Sets from address to the mail.
   * @param {string} from
   * @return {}
   */
  setFrom(from: string) {
    this.from = from;
    return this;
  }

  /**
   * Set attachments to the mail.
   * @param {IMailAttachment[]} attachments 
   * @returns {Mail}
   */
  setAttachments(attachments: IMailAttachment[]) {
    this.attachments = attachments;
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

  setContent(content: string) {
    this.content = content;
    return this;
  }

  /**
   * Renders the view template with the given data.
   * @param  {object} data
   * @return {string}
   */
  static render(view: string, data: Record<string, any>): string {
    const viewContent = Mail.getViewContent(view);
    return Mustache.render(viewContent, data);
  }

  /**
   * Retrieve view content from the view directory.
   */
  static getViewContent(view: string): string {
    const filePath = path.join(global.__views_dir, `/${view}`);
    return fs.readFileSync(filePath, 'utf8');
  }
}
