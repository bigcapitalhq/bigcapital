import { Injectable } from '@nestjs/common';
import { events } from '@/common/events/events';
import { OnEvent } from '@nestjs/event-emitter';
import {
  IAuthSendedResetPassword,
  IAuthSignedUpEventPayload,
  ISignUpConfigmResendedEventPayload,
} from '../Auth.interfaces';
import { Queue } from 'bullmq';
import { InjectQueue } from '@nestjs/bullmq';
import { SendResetPasswordMailJobPayload } from '../processors/SendResetPasswordMail.processor';
import {
  SendResetPasswordMailJob,
  SendResetPasswordMailQueue,
  SendSignupVerificationMailJob,
  SendSignupVerificationMailQueue,
} from '../Auth.constants';
import { SendSignupVerificationMailJobPayload } from '../processors/SendSignupVerificationMail.processor';

@Injectable()
export class AuthMailSubscriber {
  constructor(
    @InjectQueue(SendResetPasswordMailQueue)
    private readonly sendResetPasswordMailQueue: Queue,

    @InjectQueue(SendSignupVerificationMailQueue)
    private readonly sendSignupVerificationMailQueue: Queue,
  ) {}

  /**
   * @param {IAuthSignedUpEventPayload | ISignUpConfigmResendedEventPayload} payload
   */
  @OnEvent(events.auth.signUp)
  @OnEvent(events.auth.signUpConfirmResended)
  async handleSignupSendVerificationMail(
    payload: IAuthSignedUpEventPayload | ISignUpConfigmResendedEventPayload,
  ) {
    try {
      await this.sendSignupVerificationMailQueue.add(
        SendSignupVerificationMailJob,
        {
          email: payload.user.email,
          fullName: payload.user.firstName,
          token: payload.user.verifyToken,
        } as SendSignupVerificationMailJobPayload,
        {
          delay: 0,
        },
      );
    } catch (error) {
      console.log(error);
    }
  }

  /**
   * @param {IAuthSendedResetPassword} payload
   */
  @OnEvent(events.auth.sendResetPassword)
  async handleSendResetPasswordMail(payload: IAuthSendedResetPassword) {
    await this.sendResetPasswordMailQueue.add(
      SendResetPasswordMailJob,
      {
        user: payload.user,
        token: payload.token,
      } as SendResetPasswordMailJobPayload,
      {
        delay: 0,
      },
    );
  }
}
