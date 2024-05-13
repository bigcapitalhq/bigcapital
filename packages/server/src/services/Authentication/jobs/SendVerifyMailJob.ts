import { Container } from 'typedi';
import AuthenticationMailMesssages from '@/services/Authentication/AuthenticationMailMessages';

export class SendVerifyMailJob {
  /**
   * Constructor method.
   * @param {Agenda} agenda
   */
  constructor(agenda) {
    agenda.define(
      'send-signup-verify-mail',
      { priority: 'high' },
      this.handler.bind(this)
    );
  }

  /**
   * Handle send welcome mail job.
   * @param {Job} job
   * @param {Function} done
   */
  public async handler(job, done: Function): Promise<void> {
    const { data } = job.attrs;
    const { email, fullName, token } = data;
    const authService = Container.get(AuthenticationMailMesssages);

    try {
      await authService.sendSignupVerificationMail(email, fullName, token);
      done();
    } catch (error) {
      console.log(error);
      done(error);
    }
  }
}
