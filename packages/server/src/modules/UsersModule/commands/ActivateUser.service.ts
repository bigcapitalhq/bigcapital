import { events } from '@/common/events/events';
import { ServiceError } from '@/modules/Items/ServiceError';
import { TenantModelProxy } from '@/modules/System/models/TenantBaseModel';
import { TenancyContext } from '@/modules/Tenancy/TenancyContext.service';
import { TenantUser } from '@/modules/Tenancy/TenancyModels/models/TenantUser.model';
import { Inject, Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { ERRORS } from '../Users.constants';
import { ModelObject } from 'objection';
import { SystemUser } from '@/modules/System/models/SystemUser';
import { ITenantUserActivatedPayload } from '../Users.types';

@Injectable()
export class ActivateUserService {
  constructor(
    @Inject(TenantUser.name)
    private readonly tenantUserModel: TenantModelProxy<typeof TenantUser>,
    private readonly tenancyContext: TenancyContext,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  /**
   * Activate the given user id.
   * @param {number} userId - User id.
   * @return {Promise<void>}
   */
  public async activateUser(userId: number): Promise<void> {
    const authorizedUser = await this.tenancyContext.getSystemUser();

    // Throw service error if the given user is equals the authorized user.
    this.throwErrorIfUserSameAuthorizedUser(userId, authorizedUser);

    // Retrieve the user or throw not found service error.
    const tenantUser = await this.tenantUserModel().query().findById(userId);

    // Throw serivce error if the user is already activated.
    this.throwErrorIfUserActive(tenantUser);

    // Marks the tenant user as active.
    await this.tenantUserModel()
      .query()
      .findById(userId)
      .update({ active: true });

    // Triggers `onTenantUserActivated` event.
    await this.eventEmitter.emitAsync(events.tenantUser.onActivated, {
      userId,
      tenantUser,
    } as ITenantUserActivatedPayload);
  }

  /**
   * Throws service error in case the user was already active.
   * @param {ISystemUser} user
   * @throws {ServiceError}
   */
  private throwErrorIfUserActive(user: ModelObject<TenantUser>) {
    if (user.active) {
      throw new ServiceError(ERRORS.USER_ALREADY_ACTIVE);
    }
  }

  /**
   * Throw service error in case the given user same the authorized user.
   * @param {number} userId
   * @param {ModelObject<TenantUser>} authorizedUser
   */
  private throwErrorIfUserSameAuthorizedUser(
    userId: number,
    authorizedUser: ModelObject<SystemUser>,
  ) {
    if (userId === authorizedUser.id) {
      throw new ServiceError(ERRORS.USER_SAME_THE_AUTHORIZED_USER);
    }
  }
}
