import { AbilitySchema } from '../AbilitySchema';
import { Injectable } from '@nestjs/common';

@Injectable()
export class RolePermissionsSchema {
  /**
   * Retrieve the role permissions schema.
   */
  getRolePermissionsSchema() {
    return AbilitySchema;
  }
}
