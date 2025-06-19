import { Injectable } from '@nestjs/common';
import { CreateRoleService } from './commands/CreateRole.service';
import { DeleteRoleService } from './commands/DeleteRole.service';
import { EditRoleService } from './commands/EditRole.service';
import { GetRoleService } from './queries/GetRole.service';
import { GetRolesService } from './queries/GetRoles.service';
import { RolePermissionsSchema } from './queries/RolePermissionsSchema';

@Injectable()
export class RolesApplication {
  constructor(
    private readonly createRoleService: CreateRoleService,
    private readonly editRoleService: EditRoleService,
    private readonly deleteRoleService: DeleteRoleService,
    private readonly getRoleService: GetRoleService,
    private readonly getRolesService: GetRolesService,
    private readonly getRolePermissionsSchemaService: RolePermissionsSchema,
  ) {}

  /**
   * Creates a new role.
   * @param createRoleDto The data for creating a new role.
   * @returns The created role.
   */
  async createRole(createRoleDto: any) {
    return this.createRoleService.createRole(createRoleDto);
  }

  /**
   * Edits an existing role.
   * @param roleId The ID of the role to edit.
   * @param editRoleDto The data for editing the role.
   * @returns The edited role.
   */
  async editRole(roleId: number, editRoleDto: any) {
    return this.editRoleService.editRole(roleId, editRoleDto);
  }

  /**
   * Deletes a role.
   * @param roleId The ID of the role to delete.
   * @returns The result of the deletion operation.
   */
  async deleteRole(roleId: number) {
    return this.deleteRoleService.deleteRole(roleId);
  }

  /**
   * Gets a specific role by ID.
   * @param roleId The ID of the role to retrieve.
   * @returns The requested role.
   */
  async getRole(roleId: number) {
    return this.getRoleService.getRole(roleId);
  }

  /**
   * Lists all roles.
   * @returns A list of all roles.
   */
  async getRoles() {
    return this.getRolesService.getRoles();
  }

  /**
   * Gets the role permissions schema.
   * @returns The role permissions schema.
   */
  getRolePermissionsSchema() {
    return this.getRolePermissionsSchemaService.getRolePermissionsSchema();
  }
}
