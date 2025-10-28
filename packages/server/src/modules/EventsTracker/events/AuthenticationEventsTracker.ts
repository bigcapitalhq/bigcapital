import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { EventTrackerService } from '../EventTracker.service';
import { AUTH_SIGNED_UP } from '../event-tracker';
import { events } from '@/common/events/events';

@Injectable()
export class AuthenticationEventsTracker {
  constructor(public readonly posthog: EventTrackerService) {}

  // @OnEvent(events.auth.onSignedUp)
  // public handleTrackSignUpEvent({ user }: IAuthSignedUpEventPayload) {
  //   this.posthog.trackEvent({
  //     event: AUTH_SIGNED_UP,
  //     properties: {
  //       firstName: user.firstName,
  //       lastName: user.lastName,
  //       email: user.email,
  //     },
  //   });
  // }
}
