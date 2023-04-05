import { Service, Inject } from 'typedi';
import events from '@/subscribers/events';

@Service()
export default class AuthSendWelcomeMailSubscriber {
  @Inject('agenda')
  agenda: any;

  /**
   * Attaches events with handlers.
   */
  public attach(bus) {
    bus.subscribe(events.auth.signUp, this.sendWelcomeEmailOnceUserRegister);
  }

  /**
   * Sends welcome email once the user register.
   */
  private sendWelcomeEmailOnceUserRegister = async (payload) => {
    const { tenant, user } = payload;

    // Send welcome mail to the user.
    await this.agenda.now('welcome-email', {
      organizationId: tenant.organizationId,
      user,
    });
  };
}
