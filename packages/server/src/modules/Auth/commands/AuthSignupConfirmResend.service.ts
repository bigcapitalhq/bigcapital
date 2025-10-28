import { EventEmitter2 } from '@nestjs/event-emitter';
import { Inject, Injectable } from '@nestjs/common';
import { SystemUser } from '@/modules/System/models/SystemUser';
import { ServiceError } from '@/modules/Items/ServiceError';
import { ERRORS } from '../Auth.constants';
import { events } from '@/common/events/events';
import { ModelObject } from 'objection';
import { ISignUpConfigmResendedEventPayload } from '../Auth.interfaces';
import { TenancyContext } from '@/modules/Tenancy/TenancyContext.service';

@Injectable()
export class AuthSignupConfirmResendService {
  constructor(
    private readonly eventPublisher: EventEmitter2,
    private readonly tenancyContext: TenancyContext,

    @Inject(SystemUser.name)
    private readonly systemUserModel: typeof SystemUser,
  ) {}

  /**
   * Resends the email confirmation of the given user.
   * @param {number} userId - System User ID.
   * @returns {Promise<void>}
   */
  public async signUpConfirmResend() {
    const user = await this.tenancyContext.getSystemUser();

    // Throw error if the user is already verified.
    if (user.verified) {
      throw new ServiceError(ERRORS.USER_ALREADY_VERIFIED);
    }
    // Throw error if the verification token is not exist.
    if (!user.verifyToken) {
      throw new ServiceError(ERRORS.USER_ALREADY_VERIFIED);
    }
    // Triggers `signUpConfirmResended` event.
    await this.eventPublisher.emitAsync(events.auth.signUpConfirmResended, {
      user,
    } as ISignUpConfigmResendedEventPayload);
  }
}
