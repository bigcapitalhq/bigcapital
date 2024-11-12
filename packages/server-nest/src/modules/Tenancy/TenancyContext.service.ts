import { Inject, Injectable } from '@nestjs/common';
import { ClsService } from 'nestjs-cls';
import { SystemUser } from '../System/models/SystemUser';
import { TenantModel } from '../System/models/TenantModel';

@Injectable()
export class TenancyContext {
  constructor(
    private readonly cls: ClsService,

    @Inject(SystemUser.name)
    private readonly systemUserModel: typeof SystemUser,

    @Inject(TenantModel.name)
    private readonly systemTenantModel: typeof TenantModel,
  ) {}

  /**
   * Get the current tenant.
   * @returns
   */
  getTenant() {
    // Get the tenant from the request headers.
    const organizationId = this.cls.get('organizationId');

    return this.systemTenantModel.query().findOne({ organizationId });
  }

  /**
   *
   * @returns
   */
  getSystemUser() {
    // Get the user from the request headers.
    const userId = this.cls.get('userId');

    return this.systemUserModel.query().findOne({ id: userId });
  }
}
