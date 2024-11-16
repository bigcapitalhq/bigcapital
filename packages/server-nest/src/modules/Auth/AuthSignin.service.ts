import { Inject, Injectable } from '@nestjs/common';
import { cloneDeep } from 'lodash';
import { SystemUser } from '../System/models/SystemUser';
import { TenantModel } from '../System/models/TenantModel';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { events } from '@/common/events/events';
import { ServiceError } from '../Items/ServiceError';
import { ERRORS } from '../Items/Items.constants';
import {
  IAuthSignedInEventPayload,
  IAuthSigningInEventPayload,
  IAuthSignInPOJO,
} from './Auth.interfaces';

@Injectable()
export class AuthSigninService {
  constructor(
    private readonly eventEmitter: EventEmitter2,

    @Inject(SystemUser.name)
    private readonly systemUserModel: typeof SystemUser,

    @Inject(TenantModel.name)
    private readonly tenantModel: typeof TenantModel,
  ) {}

  /**
   * Validates the given email and password.
   * @param {ISystemUser} user
   */
  public async validateSignIn(user: SystemUser) {
    // Validate if the given user is inactive.
    if (!user.active) {
      throw new ServiceError(ERRORS.USER_INACTIVE);
    }
  }

  /**
   * sign-in and generates JWT token.
   * @param {string} email - Email address.
   * @param {string} password - Password.
   * @return {Promise<{user: IUser, token: string}>}
   */
  public async signIn(
    email: string,
    password: string,
  ): Promise<IAuthSignInPOJO> {
    // Finds the user of the given email address.
    const user = await SystemUser.query()
      .findOne('email', email)
      .modify('inviteAccepted');

    // Validate the given email and password.
    await this.validateSignIn(user);

    // Triggers on signing-in event.
    await this.eventEmitter.emitAsync(events.auth.signingIn, {
      email,
      password,
      user,
    } as IAuthSigningInEventPayload);

    const token = generateToken(user);

    // Update the last login at of the user.
    // await systemUserRepository.patchLastLoginAt(user.id);

    // Triggers `onSignIn` event.
    await this.eventEmitter.emitAsync(events.auth.signIn, {
      email,
      password,
      user,
    } as IAuthSignedInEventPayload);

    const tenant = await this.tenantModel
      .query()
      .findById(user.tenantId)
      .withGraphFetched('metadata');

    // Keep the user object immutable.
    const outputUser = cloneDeep(user);

    // Remove password property from user object.
    Reflect.deleteProperty(outputUser, 'password');

    return { user: outputUser, token, tenant };
  }
}
