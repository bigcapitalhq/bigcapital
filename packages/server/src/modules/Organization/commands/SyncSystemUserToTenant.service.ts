import { Inject, Injectable } from '@nestjs/common';
import { pick } from 'lodash';
import { Role } from '@/modules/Roles/models/Role.model';
import { SystemUser } from '@/modules/System/models/SystemUser';
import { TenantModelProxy } from '@/modules/System/models/TenantBaseModel';
import { TenantUser } from '@/modules/Tenancy/TenancyModels/models/TenantUser.model';

@Injectable()
export class SyncSystemUserToTenantService {
  constructor(
    @Inject(TenantUser.name)
    private readonly tenantUserModel: TenantModelProxy<typeof TenantUser>,

    @Inject(Role.name)
    private readonly roleModel: TenantModelProxy<typeof Role>,

    @Inject(SystemUser.name)
    private readonly systemUserModel: typeof SystemUser,
  ) {}

  /**
   * Syncs system user to tenant user.
   * @param {number} systemUserId - System user id.
   */
  public async syncSystemUserToTenant(systemUserId: number) {
    const adminRole = await this.roleModel().query().findOne('slug', 'admin');
    const systemUser = await this.systemUserModel
      .query()
      .findById(systemUserId);

    await this.tenantUserModel()
      .query()
      .insert({
        ...pick(systemUser, [
          'firstName',
          'lastName',
          'phoneNumber',
          'email',
          'active',
          'inviteAcceptedAt',
        ]),
        systemUserId: systemUser.id,
        roleId: adminRole.id,
      });
  }
}
