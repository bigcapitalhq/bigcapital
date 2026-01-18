import { Knex } from 'knex';
import { IRoleEditedPayload } from '../Roles.types';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { events } from '@/common/events/events';
import { EditRoleDto } from '../dtos/Role.dto';
import { Inject, Injectable } from '@nestjs/common';
import { TenantModelProxy } from '@/modules/System/models/TenantBaseModel';
import { Role } from '../models/Role.model';
import { UnitOfWork } from '@/modules/Tenancy/TenancyDB/UnitOfWork.service';
import { validateInvalidPermissions } from '../utils';

@Injectable()
export class EditRoleService {
  constructor(
    private readonly uow: UnitOfWork,
    private readonly eventPublisher: EventEmitter2,

    @Inject(Role.name)
    private readonly roleModel: TenantModelProxy<typeof Role>,
  ) { }

  /**
   * Edits details of the given role on the storage.
   * @param {number} roleId - Role id.
   * @param {IEditRoleDTO} editRoleDTO - Edit role DTO.
   */
  public async editRole(roleId: number, editRoleDTO: EditRoleDto) {
    // Validates the invalid permissions.
    validateInvalidPermissions(editRoleDTO.permissions);

    // Retrieve the given role or throw not found serice error.
    const oldRole = await this.roleModel().query().findById(roleId);
    // Transform permissions: map permissionId to id for Objection.js upsertGraph
    const permissions = editRoleDTO.permissions.map((perm) => ({
      id: perm.permissionId,
      subject: perm.subject,
      ability: perm.ability,
      value: perm.value,
    }));

    // Updates the role on the storage.
    return this.uow.withTransaction(async (trx: Knex.Transaction) => {
      // Updates the given role to the storage.
      const role = await this.roleModel().query(trx).upsertGraph({
        id: roleId,
        name: editRoleDTO.roleName,
        description: editRoleDTO.roleDescription,
        permissions,
      });
      // Triggers `onRoleEdited` event.
      await this.eventPublisher.emitAsync(events.roles.onEdited, {
        editRoleDTO,
        oldRole,
        role,
        trx,
      } as IRoleEditedPayload);

      return role;
    });
  }
}
