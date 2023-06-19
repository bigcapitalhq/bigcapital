import { Container } from 'typedi';
import AuthenticationMailMessages from '@/services/Authentication/AuthenticationMailMessages';

export default class ResetPasswordEmailJob {
  /**
   * Constructor method.
   * @param {Agenda} agenda
   */
  constructor(agenda) {
    agenda.define(
      'reset-password-mail',
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
    const { user, token } = data;
    const authService = Container.get(AuthenticationMailMessages);

    try {
      await authService.sendResetPasswordMessage(user, token);
      done();
    } catch (error) {
      console.log(error);
      done(error);
    }
  }
}
