import { Container, Service } from 'typedi';
import events from '@/subscribers/events';
import { IAuthSignedInEventPayload } from '@/interfaces';

@Service()
export default class ResetLoginThrottleSubscriber {
  /**
   * Attaches events with handlers.
   * @param bus
   */
  public attach(bus) {
    bus.subscribe(events.auth.signIn, this.resetLoginThrottleOnceSuccessLogin);
  }

  /**
   * Resets the login throttle once the login success.
   * @param {IAuthSignedInEventPayload} payload -
   */
  private async resetLoginThrottleOnceSuccessLogin(
    payload: IAuthSignedInEventPayload
  ) {
    const { email, user } = payload;
    const loginThrottler = Container.get('rateLimiter.login');

    // Reset the login throttle by the given email and phone number.
    await loginThrottler.reset(user.email);
    await loginThrottler.reset(email);
  }
}
