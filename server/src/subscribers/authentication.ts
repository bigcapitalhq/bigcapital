import { Container } from 'typedi';
import { pick } from 'lodash';
import { EventSubscriber, On } from 'event-dispatch';
import events from 'subscribers/events';

@EventSubscriber()
export class AuthenticationSubscriber {

  @On(events.auth.login)
  public onLogin(payload) {
    const { emailOrPhone, password } = payload;
  }

  @On(events.auth.register)
  public onRegister(payload) {
    const { registerDTO, user } = payload;

    const agenda = Container.get('agenda');

    // Send welcome mail to the user.
    agenda.now('welcome-email', {
      ...pick(registerDTO, ['organizationName']),
      user,
    });
  }

  @On(events.auth.resetPassword)
  public onResetPassword(payload) {

  }

  @On(events.auth.sendResetPassword)
  public onSendResetPassword (payload) { 
    const { user, token } = payload;
    const agenda = Container.get('agenda');

    // Send reset password mail.
    agenda.now('reset-password-mail', { user, token })
  }
}