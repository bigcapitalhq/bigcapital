import { ServiceError } from '@/exceptions';
import { SystemUser } from '@/system/models';
import { Inject, Service } from 'typedi';
import { ERRORS } from './_constants';

@Service()
export class AuthSignupConfirmResend {
  @Inject('agenda')
  private agenda: any;

  /**
   *
   * @param {number} tenantId
   * @param {string} email
   */
  public async signUpConfirmResend(email: string) {
    const user = await SystemUser.query()
      .findOne({ email })
      .throwIfNotFound();

    // 
    if (user.verified) {
      throw new ServiceError(ERRORS.USER_ALREADY_VERIFIED)
    }
    if (user.verifyToken) {
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
