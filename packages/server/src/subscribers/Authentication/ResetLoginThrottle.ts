import { Container, Service } from 'typedi';
import events from '@/subscribers/events';

@Service()
export default class ResetLoginThrottleSubscriber {
  /**
   * Attaches events with handlers.
   * @param bus 
   */
  public attach(bus) {
    bus.subscribe(events.auth.login, this.resetLoginThrottleOnceSuccessLogin);
  }

  /**
   * Resets the login throttle once the login success.
   */
  private async resetLoginThrottleOnceSuccessLogin(payload) {
    const { emailOrPhone, password, user } = payload;

    const loginThrottler = Container.get('rateLimiter.login');

    // Reset the login throttle by the given email and phone number.
    await loginThrottler.reset(user.email);
    await loginThrottler.reset(user.phoneNumber);
    await loginThrottler.reset(emailOrPhone);
  }
}
