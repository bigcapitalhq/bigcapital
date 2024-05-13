import { Inject, Service } from 'typedi';
import { ServiceError } from '@/exceptions';
import { SystemUser } from '@/system/models';
import { ERRORS } from './_constants';

@Service()
export class AuthSignupConfirmResend {
  @Inject('agenda')
  private agenda: any;

  /**
   * Resends the email confirmation of the given user.
   * @param {number} userId - User ID.
   * @returns {Promise<void>}
   */
  public async signUpConfirmResend(userId: number) {
    const user = await SystemUser.query().findById(userId).throwIfNotFound();

    // Throw error if the user is already verified.
    if (user.verified) {
      throw new ServiceError(ERRORS.USER_ALREADY_VERIFIED);
    }
    // Throw error if the verification token is not exist.
    if (!user.verifyToken) {
      throw new ServiceError(ERRORS.USER_ALREADY_VERIFIED);
    }
    const payload = {
      email: user.email,
      token: user.verifyToken,
      fullName: user.firstName,
    };
    await this.agenda.now('send-signup-verify-mail', payload);
  }
}
