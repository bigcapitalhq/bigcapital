import { ClsService } from 'nestjs-cls';
import { Inject, Injectable } from '@nestjs/common';
import { SystemPlaidItem } from '../models/SystemPlaidItem';
import { TenantModel } from '@/modules/System/models/TenantModel';
import { SystemUser } from '@/modules/System/models/SystemUser';

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

    const user = await this.systemUserModel
      .query()
      .findOne({
        tenantId: tenant.id,
      })
      .modify('active')
      .throwIfNotFound();

    this.clsService.set('organizationId', tenant.organizationId);
    this.clsService.set('userId', user.id);

    return callback();
  }
}
