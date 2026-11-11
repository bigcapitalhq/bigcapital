import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { OnEvent } from '@nestjs/event-emitter';
import { events } from '@/common/events/events';
import { IAuthSignedUpEventPayload } from '@/modules/Auth/Auth.interfaces';
import { StartTrialSubscriptionService } from '../commands/StartTrialSubscription.service';

@Injectable()
export class StartTrialOnSignupCloud {
  constructor(
    private readonly startTrialSubscription: StartTrialSubscriptionService,
    private readonly configService: ConfigService,
  ) {}

  /**
   * Starts a full-access trial once a Cloud organization signs up.
   */
  @OnEvent(events.auth.signUp)
  async startTrialOnSignup({
    tenant,
  }: IAuthSignedUpEventPayload): Promise<void> {
    if (this.configService.get('cloud.hostedOnCloud') !== true) return;

    await this.startTrialSubscription.execute(tenant.id);
  }
}
