import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { Profile } from 'passport-google-oauth20';
import { SystemUser } from '@/modules/System/models/SystemUser';
import { AuthSignupService } from './AuthSignup.service';
import { ERRORS } from '../Auth.constants';

/**
 * Resolves a Google OAuth profile to a system user.
 *
 * The resolution order is:
 *  1. An account already linked to the Google id.
 *  2. An existing account with the same email (the Google id is linked).
 *  3. A brand new account, created with the same rules as email sign-up.
 */
@Injectable()
export class AuthGoogleSigninService {
  constructor(
    @Inject(SystemUser.name)
    private readonly systemUserModel: typeof SystemUser,

    private readonly authSignupService: AuthSignupService,
  ) {}

  /**
   * Maps the Google profile to a system user, creating one when needed.
   * @param {Profile} profile - Google profile returned by passport.
   * @returns {Promise<SystemUser>}
   */
  public async validateGoogleProfile(profile: Profile): Promise<SystemUser> {
    const googleId = profile.id;
    const primaryEmail = profile.emails?.[0];
    const email = primaryEmail?.value?.trim().toLowerCase();

    if (!googleId) {
      throw new UnauthorizedException('The Google account id is missing.');
    }
    if (!email || primaryEmail?.verified === false) {
      throw new UnauthorizedException(
        'The Google account does not expose a verified email address.',
      );
    }

    // 1. Account already linked to this Google id.
    const linkedUser = await this.systemUserModel.query().findOne({ googleId });

    if (linkedUser) {
      this.assertUserIsActive(linkedUser);
      return linkedUser;
    }

    // 2. Existing account with the same email: link the Google id.
    const existingUser = await this.systemUserModel.query().findOne({ email });

    if (existingUser) {
      this.assertUserIsActive(existingUser);

      if (existingUser.googleId && existingUser.googleId !== googleId) {
        throw new UnauthorizedException(
          'This email address is linked to a different Google account.',
        );
      }
      // Google already verified the email address, so any pending email
      // confirmation is satisfied by linking the account.
      const linkedUser = await this.systemUserModel
        .query()
        .patchAndFetchById(existingUser.id, {
          googleId,
          verified: true,
          verifyToken: '',
        });
      return linkedUser as SystemUser;
    }

    // 3. Create a new account (respecting sign-up restrictions).
    return this.authSignupService.signUpWithGoogle({
      googleId,
      email,
      firstName: profile.name?.givenName ?? '',
      lastName: profile.name?.familyName ?? '',
    });
  }

  /**
   * Rejects suspended accounts.
   * @param {SystemUser} user
   */
  private assertUserIsActive(user: SystemUser): void {
    if (user.active === false) {
      throw new UnauthorizedException({
        message: 'The user account is inactive.',
        errors: [{ type: ERRORS.USER_INACTIVE }],
      });
    }
  }
}
