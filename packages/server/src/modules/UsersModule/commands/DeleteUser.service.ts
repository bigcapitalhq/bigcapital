import { EventEmitter2 } from '@nestjs/event-emitter';
import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import { TenantModelProxy } from '@/modules/System/models/TenantBaseModel';
import { TenantUser } from '@/modules/Tenancy/TenancyModels/models/TenantUser.model';
import { UserTenant } from '@/modules/System/models/UserTenant.model';
import { ITenantUserDeletedPayload } from '../Users.types';
import { events } from '@/common/events/events';
import { ServiceError } from '@/modules/Items/ServiceError';
import { ERRORS } from '../Users.constants';
import { TenancyContext } from '@/modules/Tenancy/TenancyContext.service';
import { isTenantOwner } from '../Users.utils';

@Injectable()
export class DeleteUserService {
  constructor(
    @Inject(TenantUser.name)
    private readonly tenantUserModel: TenantModelProxy<typeof TenantUser>,

    private readonly tenancyContext: TenancyContext,

    @Inject(UserTenant.name)
    private readonly userTenantModel: typeof UserTenant,

    private readonly eventEmitter: EventEmitter2,
  ) {}

  /**
   * Deletes the given user id.
   * @param {number} userId - User id.
   */
  async deleteUser(userId: number): Promise<void> {
    // Retrieve user details or throw not found service error.
    const tenantUser = await this.tenantUserModel()
      .query()
      .findById(userId)
      .throwIfNotFound();

    // Validate the workspace owner cannot be deleted.
    await this.validateNotTenantOwner(tenantUser);

    // Validate the delete user should not be the last active user.
    if (tenantUser.isInviteAccepted) {
      await this.validateNotLastUserDelete();
    }
    // Delete user from the storage.
    await this.tenantUserModel().query().findById(userId).delete();

    // Triggers `onTenantUserDeleted` event.
    await this.eventEmitter.emitAsync(events.tenantUser.onDeleted, {
      userId,
      tenantUser,
    } as ITenantUserDeletedPayload);
  }

  /**
   * Validate the given user is not the workspace owner.
   * @param {TenantUser} tenantUser
   * @throws {ServiceError}
   */
  private async validateNotTenantOwner(tenantUser: TenantUser): Promise<void> {
    const isOwner = await isTenantOwner(
      tenantUser,
      this.userTenantModel,
      this.tenancyContext,
    );
    if (isOwner) {
      throw new ServiceError(
        ERRORS.CANNOT_MUTATE_TENANT_OWNER,
        'The workspace owner cannot be deleted.',
        null,
        HttpStatus.FORBIDDEN,
      );
    }
  }

  /**
   * Validate the delete user should not be the last user.
   * @param {number} tenantId
   */
  private async validateNotLastUserDelete() {
    const inviteAcceptedUsers = await this.tenantUserModel()
      .query()
      .select(['id'])
      .whereNotNull('invite_accepted_at');

    if (inviteAcceptedUsers.length === 1) {
      throw new ServiceError(ERRORS.CANNOT_DELETE_LAST_USER);
    }
  }
}
