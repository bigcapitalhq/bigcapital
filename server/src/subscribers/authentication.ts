import { Container } from 'typedi';
import { pick } from 'lodash';
import { EventSubscriber, On } from 'event-dispatch';
import events from 'subscribers/events';

@EventSubscriber()
export class AuthenticationSubscriber {
  /**
   * Resets the login throttle once the login success.
   */
  @On(events.auth.login)
  public async resetLoginThrottleOnceSuccessLogin(payload) {
    const { emailOrPhone, password, user } = payload;

    const loginThrottler = Container.get('rateLimiter.login');

    // Reset the login throttle by the given email and phone number.
    await loginThrottler.reset(user.email);
    await loginThrottler.reset(user.phoneNumber);
    await loginThrottler.reset(emailOrPhone);
  }

  /**
   * Sends welcome email once the user register.
   */
  @On(events.auth.register)
  public async sendWelcomeEmail(payload) {
    const { registerDTO, tenant, user } = payload;

    const agenda = Container.get('agenda');

    // Send welcome mail to the user.
    await agenda.now('welcome-email', {
      organizationId: tenant.organizationId,
      user,
    });
  }

  /**
   * Sends reset password mail once the reset password success.
   */
  @On(events.auth.sendResetPassword)
  public onSendResetPassword (payload) { 
    const { user, token } = payload;
    const agenda = Container.get('agenda');

    // Send reset password mail.
    agenda.now('reset-password-mail', { user, token })
  }
}