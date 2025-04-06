import { Knex } from 'knex';
import { IRoleCreatedPayload } from '../Roles.types';
import { Role } from './../models/Role.model';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { UnitOfWork } from '../../Tenancy/TenancyDB/UnitOfWork.service';
import { events } from '@/common/events/events';
import { CreateRoleDto } from '../dtos/Role.dto';
import { TenantModelProxy } from '@/modules/System/models/TenantBaseModel';
import { Inject, Injectable } from '@nestjs/common';
import { validateInvalidPermissions } from '../utils';

@Injectable()
export class CreateRoleService {
  constructor(
    private readonly uow: UnitOfWork,
    private readonly eventPublisher: EventEmitter2,

    @Inject(Role.name)
    private readonly roleModel: TenantModelProxy<typeof Role>,
  ) {}

  /**
   * Creates a new role and store it to the storage.
   * @param {CreateRoleDto} createRoleDTO -
   * @returns
   */
  public async createRole(createRoleDTO: CreateRoleDto) {
    // Validates the invalid permissions.
    validateInvalidPermissions(createRoleDTO.permissions);

    // Transformes the permissions DTO.
    const permissions = createRoleDTO.permissions;

    // Creates a new role with associated entries under unit-of-work.
    return this.uow.withTransaction(async (trx: Knex.Transaction) => {
      // Creates a new role to the storage.
      const role = await this.roleModel().query(trx).upsertGraph({
        name: createRoleDTO.roleName,
        description: createRoleDTO.roleDescription,
        permissions,
      });
      // Triggers `onRoleCreated` event.
      await this.eventPublisher.emitAsync(events.roles.onCreated, {
        createRoleDTO,
        role,
        trx,
      } as IRoleCreatedPayload);

      return role;
    });
  }
}
