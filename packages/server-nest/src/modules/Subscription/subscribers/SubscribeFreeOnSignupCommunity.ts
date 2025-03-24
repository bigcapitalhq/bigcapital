import { Subscription } from '../Subscription';
import { OnEvent } from '@nestjs/event-emitter';
import { Injectable } from '@nestjs/common';
import { events } from '@/common/events/events';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class SubscribeFreeOnSignupCommunity {
  constructor(
    private readonly subscriptionService: Subscription,
    private readonly configService: ConfigService,
  ) {}

  /**
   * Creates a new free subscription once the user signup if the app is self-hosted.
   * @param {IAuthSignedUpEventPayload}
   * @returns {Promise<void>}
   */
  @OnEvent(events.auth.signUp)
  async subscribeFreeOnSigupCommunity({
    signupDTO,
    tenant,
    user,
  }: IAuthSignedUpEventPayload) {
    if (this.configService.get('hostedOnBigcapitalCloud')) return null;

    await this.subscriptionService.newSubscribtion(tenant.id, 'free');
  }
}
