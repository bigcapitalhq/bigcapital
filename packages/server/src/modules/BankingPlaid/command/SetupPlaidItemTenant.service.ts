import { ClsService } from 'nestjs-cls';
import { Inject, Injectable } from '@nestjs/common';
import { SystemPlaidItem } from '../models/SystemPlaidItem';
import { TenantModel } from '@/modules/System/models/TenantModel';
import { SystemUser } from '@/modules/System/models/SystemUser';
import { UserTenant } from '@/modules/System/models/UserTenant.model';

@Injectable()
export class SetupPlaidItemTenantService {
  constructor(
    private readonly clsService: ClsService,

    @Inject(SystemPlaidItem.name)
    private readonly systemPlaidItemModel: typeof SystemPlaidItem,

    @Inject(TenantModel.name)
    private readonly tenantModel: typeof TenantModel,

    @Inject(SystemUser.name)
    private readonly systemUserModel: typeof SystemUser,

    @Inject(UserTenant.name)
    private readonly userTenantModel: typeof UserTenant,
  ) {}

  /**
   * Sets up the Plaid tenant.
   * @param {string} plaidItemId - The Plaid item id.
   * @param {() => void} callback - The callback function to execute after setting up the Plaid tenant.
   * @returns {Promise<void>}
   */
  public async setupPlaidTenant(plaidItemId: string, callback: () => void) {
    const plaidItem = await this.systemPlaidItemModel
      .query()
      .findOne({ plaidItemId });

    if (!plaidItem) {
      throw new Error('Plaid item not found');
    }
    const tenant = await this.tenantModel
      .query()
      .findOne({ id: plaidItem.tenantId })
      .throwIfNotFound();

    // Workspace members are recorded in user_tenants; users.tenant_id only
    // holds each user's original tenant.
    const memberships = await this.userTenantModel
      .query()
      .where('tenantId', tenant.id);
    const membersIds = memberships.map((membership) => membership.userId);

    const user = await this.systemUserModel
      .query()
      .modify('active')
      .where((builder) => {
        builder.whereIn('id', membersIds).orWhere('tenantId', tenant.id);
      })
      .first()
      .throwIfNotFound();

    this.clsService.set('organizationId', tenant.organizationId);
    this.clsService.set('userId', user.id);

    return callback();
  }
}
