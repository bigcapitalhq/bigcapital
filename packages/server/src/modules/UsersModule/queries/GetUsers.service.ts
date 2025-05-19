import { TenantModelProxy } from '@/modules/System/models/TenantBaseModel';
import { TenantUser } from '@/modules/Tenancy/TenancyModels/models/TenantUser.model';
import { TransformerInjectable } from '@/modules/Transformer/TransformerInjectable.service';
import { Inject } from '@nestjs/common';
import { UserTransformer } from './User.transformer';

export class GetUsersService {
  constructor(
    @Inject(TenantUser.name)
    private readonly tenantUserModel: TenantModelProxy<typeof TenantUser>,
    private readonly transformerInjectable: TransformerInjectable,
  ) {}

  /**
   * Retrieve users list based on the given filter.
   * @param {object} filter
   */
  public async getUsers() {
    const users = await this.tenantUserModel().query().withGraphFetched('role');

    return this.transformerInjectable.transform(
      users,
      new UserTransformer(),
    );
  }
}
