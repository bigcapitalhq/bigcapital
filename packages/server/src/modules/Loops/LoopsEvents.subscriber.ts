import axios from 'axios';
import { OnEvent } from '@nestjs/event-emitter';
import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { IAuthSignUpVerifiedEventPayload } from '../Auth/Auth.interfaces';
import { SystemUser } from '../System/models/SystemUser';
import { events } from '@/common/events/events';

@Injectable()
export class LoopsEventsSubscriber {

  constructor(
    private readonly configService: ConfigService,

    @Inject(SystemUser.name)
    private readonly systemUserModel: typeof SystemUser
  ) {

  }
  /**
   * Once the user verified sends the event to the Loops.
   * @param {IAuthSignUpVerifiedEventPayload} param0
   */
  @OnEvent(events.auth.signUpConfirmed)
  public async triggerEventOnSignupVerified({
    email,
    userId,
  }: IAuthSignUpVerifiedEventPayload) {
    const apiKey = this.configService.get('loops.apiKey');
    
    // Can't continue since the Loops the api key is not configured.
    if (!apiKey) {
      return;
    }
    const user = await this.systemUserModel.query().findById(userId);

    const options = {
      method: 'POST',
      url: 'https://app.loops.so/api/v1/events/send',
      headers: {
        Authorization: `Bearer ${apiKey}`,
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
