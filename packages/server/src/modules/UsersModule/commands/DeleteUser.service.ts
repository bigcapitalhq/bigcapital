import { EventEmitter2 } from '@nestjs/event-emitter';
import { Inject, Injectable } from '@nestjs/common';
import { TenantModelProxy } from '@/modules/System/models/TenantBaseModel';
import { TenantUser } from '@/modules/Tenancy/TenancyModels/models/TenantUser.model';
import { ITenantUserDeletedPayload } from '../Users.types';
import { events } from '@/common/events/events';
import { ServiceError } from '@/modules/Items/ServiceError';
import { ERRORS } from '../Users.constants';
import { RolesPolicy } from '@/modules/Roles/RolesPolicy.service';

@Injectable()
export class DeleteUserService {
  constructor(
    @Inject(TenantUser.name)
    private readonly tenantUserModel: TenantModelProxy<typeof TenantUser>,
    private readonly eventEmitter: EventEmitter2,
    private readonly rolesPolicy: RolesPolicy,
  ) {}

  /**
   * Deletes the given user id.
   * @param {number} userId - User id.
   */
  async deleteUser(userId: number): Promise<void> {
    // Retrieve user details or throw not found service error.
    const tenantUser = await this.tenantUserModel().query().findById(userId);

    // Validate the delete user should not be the last active user.
    if (tenantUser.isInviteAccepted) {
      await this.validateNotLastUserDelete();
    }
    // Validate the delete user should not be the last active admin.
    await this.rolesPolicy.validateNotLastAdmin(userId);

    // Delete user from the storage.
    await this.tenantUserModel().query().findById(userId).delete();

    // Triggers `onTenantUserDeleted` event.
    await this.eventEmitter.emitAsync(events.tenantUser.onDeleted, {
      userId,
      tenantUser,
    } as ITenantUserDeletedPayload);
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
