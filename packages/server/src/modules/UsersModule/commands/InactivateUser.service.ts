import { Inject, HttpStatus, Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { ModelObject } from 'objection';
import { ServiceError } from '@/modules/Items/ServiceError';
import { TenantModelProxy } from '@/modules/System/models/TenantBaseModel';
import { TenantUser } from '@/modules/Tenancy/TenancyModels/models/TenantUser.model';
import { UserTenant } from '@/modules/System/models/UserTenant.model';
import { ERRORS } from '../Users.constants';
import { ITenantUserInactivatedPayload } from '../Users.types';
import { TenancyContext } from '@/modules/Tenancy/TenancyContext.service';
import { events } from '@/common/events/events';
import { isTenantOwner } from '../Users.utils';

@Injectable()
export class InactivateUserService {
  constructor(
    @Inject(TenantUser.name)
    private readonly tenantUserModel: TenantModelProxy<typeof TenantUser>,

    @Inject(UserTenant.name)
    private readonly userTenantModel: typeof UserTenant,

    private readonly eventEmitter: EventEmitter2,
    private readonly tenancyContext: TenancyContext,
  ) {}

  /**
   * Inactivate the given user id.
   * @param {number} userId
   * @return {Promise<void>}
   */
  public async inactivateUser(userId: number): Promise<void> {
    const authorizedUser = await this.tenancyContext.getSystemUser();
    const authorizedTenantUser = await this.tenantUserModel()
      .query()
      .findOne({ systemUserId: authorizedUser.id })
      .throwIfNotFound();

    // Throw service error if the given user is equals the authorized user.
    this.throwErrorIfUserSameAuthorizedUser(userId, authorizedTenantUser);

    // Retrieve the user or throw not found service error.
    const tenantUser = await this.tenantUserModel()
      .query()
      .findById(userId)
      .throwIfNotFound();

    // Throw serivce error if the user is already inactivated.
    this.throwErrorIfUserInactive(tenantUser);

    // Validate the workspace owner cannot be inactivated.
    await this.validateNotTenantOwner(tenantUser);

    // Marks the tenant user as inactive.
    await this.tenantUserModel()
      .query()
      .findById(userId)
      .update({ active: false });

    // Triggers `onTenantUserActivated` event.
    await this.eventEmitter.emitAsync(events.tenantUser.onInactivated, {
      userId,
      tenantUser,
    } as ITenantUserInactivatedPayload);
  }

  /**
   * Validate the given user is not the workspace owner.
   * @param {TenantUser} tenantUser
   * @throws {ServiceError}
   */
  private async validateNotTenantOwner(
    tenantUser: ModelObject<TenantUser>,
  ): Promise<void> {
    const isOwner = await isTenantOwner(
      tenantUser,
      this.userTenantModel,
      this.tenancyContext,
    );
    if (isOwner) {
      throw new ServiceError(
        ERRORS.CANNOT_MUTATE_TENANT_OWNER,
        'The workspace owner cannot be inactivated.',
        null,
        HttpStatus.FORBIDDEN,
      );
    }
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
    if (Number(userId) === authorizedUser.id) {
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
