import { Container } from 'typedi';
import MailerService from '../services/mailer';

export default class WelcomeEmailJob {
  public async handler(job, done: Function): Promise<void> {
    const Logger = Container.get('logger');

    console.log('✌Email Sequence Job triggered!');
    done();
  }
}
