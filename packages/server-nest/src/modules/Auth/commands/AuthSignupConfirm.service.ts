import { ServiceError } from '@/modules/Items/ServiceError';
import { SystemUser } from '@/modules/System/models/SystemUser';
import { Inject, Injectable } from '@nestjs/common';
import { ERRORS } from '../Auth.constants';
import { EventEmitter2 } from '@nestjs/event-emitter';
import {
  IAuthSignUpVerifiedEventPayload,
  IAuthSignUpVerifingEventPayload,
} from '../Auth.interfaces';
import { events } from '@/common/events/events';

@Injectable()
export class AuthSignupConfirmService {
  constructor(
    private readonly eventPublisher: EventEmitter2,

    @Inject(SystemUser.name)
    private readonly systemUserModel: typeof SystemUser,
  ) {}

  /**
   * Verifies the provided user's email after signing-up.
   * @throws {ServiceErrors}
   * @param {IRegisterDTO} signupDTO
   * @returns {Promise<ISystemUser>}
   */
  public async signupConfirm(
    email: string,
    verifyToken: string,
  ): Promise<SystemUser> {
    const foundUser = await this.systemUserModel
      .query()
      .findOne({ email, verifyToken });

    if (!foundUser) {
      throw new ServiceError(ERRORS.SIGNUP_CONFIRM_TOKEN_INVALID);
    }
    const userId = foundUser.id;

    // Triggers `signUpConfirming` event.
    await this.eventPublisher.emitAsync(events.auth.signUpConfirming, {
      email,
      verifyToken,
      userId,
    } as IAuthSignUpVerifingEventPayload);

    const updatedUser = await this.systemUserModel
      .query()
      .patchAndFetchById(foundUser.id, {
        verified: true,
        verifyToken: '',
      });
    // Triggers `signUpConfirmed` event.
    await this.eventPublisher.emitAsync(events.auth.signUpConfirmed, {
      email,
      verifyToken,
      userId,
    } as IAuthSignUpVerifiedEventPayload);

    return updatedUser as SystemUser;
  }
}
