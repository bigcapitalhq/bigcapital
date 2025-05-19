import { SystemUser } from '@/modules/System/models/SystemUser';
import { TenantModelProxy } from '@/modules/System/models/TenantBaseModel';
import { TenantUser } from '@/modules/Tenancy/TenancyModels/models/TenantUser.model';
import { Inject, Injectable } from '@nestjs/common';

@Injectable()
export class GetUserService {
  constructor(
    @Inject(TenantUser.name)
    private readonly tenantUserModel: TenantModelProxy<typeof TenantUser>,
  ) {}

  /**
   * Retrieve the given user details.
   * @param {number} tenantId - Tenant id.
   * @param {number} userId - User id.
   */
  public async getUser(userId: number) {
    // Retrieve the system user.
    const user = await this.tenantUserModel().query().findById(userId);

    return user;
  }
}
