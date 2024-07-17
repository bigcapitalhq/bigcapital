import axios from 'axios';
import config from '@/config';
import { IAuthSignUpVerifiedEventPayload } from '@/interfaces';
import events from '@/subscribers/events';
import { SystemUser } from '@/system/models';

export class LoopsEventsSubscriber {
  /**
   * Constructor method.
   */
  public attach(bus) {
    bus.subscribe(
      events.auth.signUpConfirmed,
      this.triggerEventOnSignupVerified.bind(this)
    );
  }

  /**
   * Once the user verified sends the event to the Loops.
   * @param {IAuthSignUpVerifiedEventPayload} param0
   */
  public async triggerEventOnSignupVerified({
    email,
    userId,
  }: IAuthSignUpVerifiedEventPayload) {
    // Can't continue since the Loops the api key is not configured.
    if (!config.loops.apiKey) {
      return;
    }
    const user = await SystemUser.query().findById(userId);

    const options = {
      method: 'POST',
      url: 'https://app.loops.so/api/v1/events/send',
      headers: {
        Authorization: `Bearer ${config.loops.apiKey}`,
        'Content-Type': 'application/json',
      },
      data: {
        email,
        userId,
        firstName: user.firstName,
        lastName: user.lastName,
        eventName: 'USER_VERIFIED',
        eventProperties: {},
        mailingLists: {},
      },
    };
    await axios(options);
  }
}
