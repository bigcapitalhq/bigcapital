import { Inject, Service } from 'typedi';
import { ServiceError } from '@/exceptions';
import { SystemUser } from '@/system/models';
import { ERRORS } from './_constants';
import { EventPublisher } from '@/lib/EventPublisher/EventPublisher';
import events from '@/subscribers/events';
import {
  IAuthSignUpVerifiedEventPayload,
  IAuthSignUpVerifingEventPayload,
} from '@/interfaces';

@Service()
export class AuthSignupConfirmService {
  @Inject()
  private eventPublisher: EventPublisher;

  /**
   * Verifies the provided user's email after signing-up.
   * @throws {ServiceErrors}
   * @param {IRegisterDTO} signupDTO
   * @returns {Promise<ISystemUser>}
   */
  public async signUpConfirm(
    email: string,
    verifyToken: string
  ): Promise<SystemUser> {
    const foundUser = await SystemUser.query().findOne({ email, verifyToken });

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

    const updatedUser = await SystemUser.query().patchAndFetchById(
      foundUser.id,
      {
        verified: true,
        verifyToken: '',
      }
    );
    // Triggers `signUpConfirmed` event.
    await this.eventPublisher.emitAsync(events.auth.signUpConfirmed, {
      email,
      verifyToken,
      userId,
    } as IAuthSignUpVerifiedEventPayload);

    return updatedUser as SystemUser;
  }
}
