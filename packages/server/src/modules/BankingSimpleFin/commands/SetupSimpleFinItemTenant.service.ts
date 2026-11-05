import { ClsService } from 'nestjs-cls';
import { Inject, Injectable } from '@nestjs/common';
import { TenantModel } from '@/modules/System/models/TenantModel';
import { SystemUser } from '@/modules/System/models/SystemUser';
import { SystemSimpleFinItem } from '../models/SystemSimpleFinItem';

@Injectable()
export class SetupSimpleFinItemTenantService {
  constructor(
    private readonly clsService: ClsService,

    @Inject(SystemSimpleFinItem.name)
    private readonly systemSimpleFinItemModel: typeof SystemSimpleFinItem,

    @Inject(TenantModel.name)
    private readonly tenantModel: typeof TenantModel,

    @Inject(SystemUser.name)
    private readonly systemUserModel: typeof SystemUser,
  ) {}

  /**
   * Resolves the tenant of the given SimpleFIN item, sets up the tenancy
   * context (CLS) and runs the callback within it.
   * @param {string} simplefinItemId
   * @param {() => T | Promise<T>} callback
   */
  public async setupSimpleFinTenant<T>(
    simplefinItemId: string,
    callback: () => T | Promise<T>,
  ): Promise<T> {
    const systemItem = await this.systemSimpleFinItemModel
      .query()
      .findOne({ simplefinItemId });

    if (!systemItem) {
      throw new Error(`SimpleFIN item ${simplefinItemId} not found.`);
    }
    const tenant = await this.tenantModel
      .query()
      .findOne({ id: systemItem.tenantId })
      .throwIfNotFound();

    const user = await this.systemUserModel
      .query()
      .findOne({ tenantId: tenant.id })
      .modify('active')
      .throwIfNotFound();

    this.clsService.set('organizationId', tenant.organizationId);
    this.clsService.set('userId', user.id);

    return callback();
  }
}
