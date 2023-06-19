import { Service, Inject } from 'typedi';
import events from '@/subscribers/events';

@Service()
export default class AuthenticationSubscriber {
  @Inject('agenda')
  private agenda: any;

  /**
   * Attaches events with handlers.
   */
  public attach(bus) {
    bus.subscribe(events.auth.sendResetPassword, this.sendPasswordMail);
  }

  /**
   * Sends reset password mail once the reset password success.
   */
  public sendPasswordMail = (payload) => {
    const { user, token } = payload;

    // Send reset password mail.
    this.agenda.now('reset-password-mail', { user, token });
  };
}
