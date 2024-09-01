import { Inject, Service } from 'typedi';
import { EventSubscriber } from '@/lib/EventPublisher/EventPublisher';
import { IAuthSignedUpEventPayload } from '@/interfaces';
import { PosthogService } from '../PostHog';
import { AUTH_SIGNED_UP } from '@/constants/event-tracker';
import events from '@/subscribers/events';

@Service()
export class AuthenticationEventsTracker extends EventSubscriber {
  @Inject()
  private posthog: PosthogService;

  /**
   * Constructor method.
   */
  public attach(bus) {
    bus.subscribe(events.auth.signUp, this.handleTrackSignUpEvent);
  }

  private handleTrackSignUpEvent = ({
    signupDTO,
    user,
    tenant,
  }: IAuthSignedUpEventPayload) => {
    this.posthog.trackEvent({
      distinctId: user.email,
      event: AUTH_SIGNED_UP,
      properties: {
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
      },
    });
  };
}
