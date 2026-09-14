import { Module } from '@nestjs/common';
import { CreateRoleService } from './commands/CreateRole.service';
import { EditRoleService } from './commands/EditRole.service';
import { DeleteRoleService } from './commands/DeleteRole.service';
import { GetRoleService } from './queries/GetRole.service';
import { GetRolesService } from './queries/GetRoles.service';
import { RegisterTenancyModel } from '../Tenancy/TenancyModels/Tenancy.module';
import { Role } from './models/Role.model';
import { RolePermission } from './models/RolePermission.model';
import { RolesController } from './Roles.controller';
import { RolesApplication } from './Roles.application';
import { RolePermissionsSchema } from './queries/RolePermissionsSchema';
import { AuthorizationGuard } from './Authorization.guard';
import { PermissionGuard } from './Permission.guard';
import { PurgeTenantAbilitiesSubscriber } from './subscribers/PurgeTenantAbilities.subscriber';

const models = [
  RegisterTenancyModel(Role),
  RegisterTenancyModel(RolePermission),
];

@Module({
  imports: [...models],
  providers: [
    CreateRoleService,
    EditRoleService,
    DeleteRoleService,
    GetRoleService,
    GetRolesService,
    RolesApplication,
    RolePermissionsSchema,
    AuthorizationGuard,
    PermissionGuard,
    PurgeTenantAbilitiesSubscriber,
  ],
  controllers: [RolesController],
  exports: [...models, AuthorizationGuard, PermissionGuard],
})
export class RolesModule {}
