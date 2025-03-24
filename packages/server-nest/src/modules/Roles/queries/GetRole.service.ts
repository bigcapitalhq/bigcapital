import { AbilitySchema } from '../AbilitySchema';
import { RoleTransformer } from './RoleTransformer';
import { Role } from '../models/Role.model';
import { TransformerInjectable } from '../../Transformer/TransformerInjectable.service';
import { ServiceError } from '../../Items/ServiceError';
import { Injectable } from '@nestjs/common';
import { CommandRolePermissionDto } from '../dtos/Role.dto';
import { ERRORS } from '../constants';

@Injectable()
export class GetRoleService {
  constructor(private readonly transformer: TransformerInjectable) {}

  /**
   * Retrieve the given role metadata.
   * @param {number} roleId - Role id.
   * @returns {Promise<IRole>}
   */
  public async getRole(roleId: number): Promise<Role> {
    const role = await Role.query()
      .findById(roleId)
      .withGraphFetched('permissions');

    this.throwRoleNotFound(role);

    return this.transformer.transform(role, new RoleTransformer());
  }

  /**
   * Validates the invalid given permissions.
   * @param {ICreateRolePermissionDTO[]} permissions -
   */
  public validateInvalidPermissions = (
    permissions: CommandRolePermissionDto[],
  ) => {
    const invalidPerms = getInvalidPermissions(AbilitySchema, permissions);

    if (invalidPerms.length > 0) {
      throw new ServiceError(ERRORS.INVALIDATE_PERMISSIONS, null, {
        invalidPermissions: invalidPerms,
      });
    }
  };
}
