import { ServiceError } from '@/modules/Items/ServiceError';
import { TenantModelProxy } from '@/modules/System/models/TenantBaseModel';
import { TenantUser } from '@/modules/Tenancy/TenancyModels/models/TenantUser.model';
import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { ModelObject } from 'objection';
import { ERRORS } from '../Users.constants';
import { ITenantUserInactivatedPayload } from '../Users.types';
import { events } from '@/common/events/events';

@Injectable()
export class InactivateUserService {
  constructor(
    private readonly tenantUserModel: TenantModelProxy<typeof TenantUser>,
    private readonly eventEmitter: EventEmitter2,
  ) {}
  /**
   * Inactivate the given user id.
   * @param {number} userId
   * @return {Promise<void>}
   */
  public async inactivateUser(userId: number): Promise<void> {
    // Throw service error if the given user is equals the authorized user.
    this.throwErrorIfUserSameAuthorizedUser(userId, authorizedUser);

    // Retrieve the user or throw not found service error.
    const tenantUser = await this.getTenantUserOrThrowError(tenantId, userId);

    // Throw serivce error if the user is already inactivated.
    this.throwErrorIfUserInactive(tenantUser);

    // Marks the tenant user as active.
    await this.tenantUserModel()
      .query()
      .findById(userId)
      .update({ active: true });

    // Triggers `onTenantUserActivated` event.
    await this.eventEmitter.emitAsync(events.tenantUser.onInactivated, {
      tenantId,
      userId,
      authorizedUser,
      tenantUser,
    } as ITenantUserInactivatedPayload);
  }

  /**
   * Throw service error in case the given user same the authorized user.
   * @param {number} userId
   * @param {ModelObject<TenantUser>} authorizedUser
   */
  private throwErrorIfUserSameAuthorizedUser(
    userId: number,
    authorizedUser: ModelObject<TenantUser>,
  ) {
    if (userId === authorizedUser.id) {
      throw new ServiceError(ERRORS.USER_SAME_THE_AUTHORIZED_USER);
    }
  }

  /**
   * Throws service error in case the user was already inactive.
   * @param {ModelObject<TenantUser>} user
   * @throws {ServiceError}
   */
  private throwErrorIfUserInactive(user: ModelObject<TenantUser>) {
    if (!user.active) {
      throw new ServiceError(ERRORS.USER_ALREADY_INACTIVE);
    }
  }
}
