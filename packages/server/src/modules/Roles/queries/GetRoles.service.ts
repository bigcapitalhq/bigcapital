import { Inject, Injectable } from '@nestjs/common';
import { Role } from '../models/Role.model';
import { TenantModelProxy } from '@/modules/System/models/TenantBaseModel';
import { TransformerInjectable } from '@/modules/Transformer/TransformerInjectable.service';
import { RoleTransformer } from './RoleTransformer';

@Injectable()
export class GetRolesService {
  constructor(
    private readonly transformer: TransformerInjectable,

    @Inject(Role.name)
    private readonly roleModel: TenantModelProxy<typeof Role>,
  ) {}

  /**
   * Retrieve the roles list.
   * @param {Promise<Role[]>}
   */
  public getRoles = async (): Promise<Role[]> => {
    const roles = await this.roleModel()
      .query()
      .withGraphFetched('permissions');

    return this.transformer.transform(roles, new RoleTransformer());
  };
}
