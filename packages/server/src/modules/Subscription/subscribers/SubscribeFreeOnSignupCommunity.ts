import { OnEvent } from '@nestjs/event-emitter';
import { Injectable } from '@nestjs/common';
import { events } from '@/common/events/events';
import { ConfigService } from '@nestjs/config';
import { SubscriptionApplication } from '../SubscriptionApplication';

@Injectable()
export class SubscribeFreeOnSignupCommunity {
  constructor(
    private readonly subscriptionApp: SubscriptionApplication,
    private readonly configService: ConfigService,
  ) { }

  /**
   * Creates a new free subscription once the user signup if the app is self-hosted.
   * @param {IAuthSignedUpEventPayload}
   * @returns {Promise<void>}
   */
  @OnEvent(events.auth.signUp)
  async subscribeFreeOnSigupCommunity({ signupDTO, tenant, user }) {
    if (this.configService.get('cloud.hostedOnCloud')) return null;

    await this.subscriptionApp.createNewSubscription('free');
  }
}
