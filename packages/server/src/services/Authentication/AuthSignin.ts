import { Container, Inject } from 'typedi';
import { cloneDeep } from 'lodash';
import { SystemUser, Tenant } from '@/system/models';
import {
  IAuthSignedInEventPayload,
  IAuthSigningInEventPayload,
  IAuthSignInPOJO,
  ISystemUser,
} from '@/interfaces';
import { ServiceError } from '@/exceptions';
import events from '@/subscribers/events';
import { EventPublisher } from '@/lib/EventPublisher/EventPublisher';
import { generateToken } from './_utils';
import { ERRORS } from './_constants';

@Inject()
export class AuthSigninService {
  @Inject()
  private eventPublisher: EventPublisher;

  @Inject('repositories')
  private sysRepositories: any;

  /**
   * Validates the given email and password.
   * @param {ISystemUser} user
   * @param {string} email
   * @param {string} password
   */
  public async validateSignIn(
    user: ISystemUser,
    email: string,
    password: string
  ) {
    const loginThrottler = Container.get('rateLimiter.login');

    // Validate if the user is not exist.
    if (!user) {
      await loginThrottler.hit(email);
      throw new ServiceError(ERRORS.INVALID_DETAILS);
    }
    // Validate if the given user's password is wrong.
    if (!user.verifyPassword(password)) {
      await loginThrottler.hit(email);
      throw new ServiceError(ERRORS.INVALID_DETAILS);
    }
    // Validate if the given user is inactive.
    if (!user.active) {
      throw new ServiceError(ERRORS.USER_INACTIVE);
    }
  }

  /**
   * Signin and generates JWT token.
   * @throws {ServiceError}
   * @param {string} email - Email address.
   * @param {string} password - Password.
   * @return {Promise<{user: IUser, token: string}>}
   */
  public async signIn(
    email: string,
    password: string
  ): Promise<IAuthSignInPOJO> {
    const { systemUserRepository } = this.sysRepositories;

    // Finds the user of the given email address.
    const user = await SystemUser.query()
      .findOne('email', email)
      .modify('inviteAccepted');

    // Validate the given email and password.
    await this.validateSignIn(user, email, password);

    // Triggers on signing-in event.
    await this.eventPublisher.emitAsync(events.auth.signingIn, {
      email,
      password,
      user,
    } as IAuthSigningInEventPayload);

    const token = generateToken(user);

    // Update the last login at of the user.
    await systemUserRepository.patchLastLoginAt(user.id);

    // Triggers `onSignIn` event.
    await this.eventPublisher.emitAsync(events.auth.signIn, {
      email,
      password,
      user,
    } as IAuthSignedInEventPayload);

    const tenant = await Tenant.query()
      .findById(user.tenantId)
      .withGraphFetched('metadata');

    // Keep the user object immutable.
    const outputUser = cloneDeep(user);

    // Remove password property from user object.
    Reflect.deleteProperty(outputUser, 'password');

    return { user: outputUser, token, tenant };
  }
}
