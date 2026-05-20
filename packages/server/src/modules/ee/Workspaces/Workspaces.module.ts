import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { WorkspacesController } from './Workspaces.controller';
import { CreateWorkspaceService } from './commands/CreateWorkspace.service';
import { DeleteWorkspaceService } from './commands/DeleteWorkspace.service';
import { DeleteWorkspaceJobService } from './commands/DeleteWorkspaceJob.service';
import { InactivateWorkspaceService } from './commands/InactivateWorkspace.service';
import { SetDefaultWorkspaceService } from './commands/SetDefaultWorkspace.service';
import { GetWorkspacesService } from './queries/GetWorkspaces.service';
import { GetWorkspaceBuildJobService } from './queries/GetWorkspaceBuildJob.service';
import { CreateUserTenantOnSignupSubscriber } from './subscribers/CreateUserTenantOnSignup.subscriber';
import { WorkspaceCreatedSubscriber } from './subscribers/WorkspaceCreated.subscriber';
import { DeleteWorkspaceProcessor } from './processors/DeleteWorkspace.processor';
import { OrganizationBuildQueue } from '@/modules/Organization/Organization.types';
import { DeleteWorkspaceQueue } from './Workspaces.types';
import { OrganizationModule } from '@/modules/Organization/Organization.module';
import { InjectSystemModel } from '@/modules/System/SystemModels/SystemModels.module';
import { UserTenant } from '@/modules/System/models/UserTenant.model';
import { SystemUser } from '@/modules/System/models/SystemUser';
import { TenantModel } from '@/modules/System/models/TenantModel';
import { TenantDBManagerModule } from '@/modules/TenantDBManager/TenantDBManager.module';
import { GetBuildOrganizationBuildJob } from '@/modules/Organization/commands/GetBuildOrganizationJob.service';
import { TenantRepository } from '@/modules/System/repositories/Tenant.repository';
import { SocketModule } from '@/modules/Socket/Socket.module';
import { S3Module } from '@/modules/S3/S3.module';
import { WorkspaceDeletedSubscriber } from './subscribers/WorkspaceDeleted.subscriber';

@Module({
  imports: [
    BullModule.registerQueue(
      { name: OrganizationBuildQueue },
      { name: DeleteWorkspaceQueue },
    ),
    TenantDBManagerModule,
    OrganizationModule,
    SocketModule,
    S3Module,
  ],
  controllers: [WorkspacesController],
  providers: [
    InjectSystemModel(UserTenant),
    InjectSystemModel(SystemUser),
    InjectSystemModel(TenantModel),
    TenantRepository,
    CreateWorkspaceService,
    DeleteWorkspaceService,
    DeleteWorkspaceJobService,
    InactivateWorkspaceService,
    SetDefaultWorkspaceService,
    GetWorkspacesService,
    GetWorkspaceBuildJobService,
    CreateUserTenantOnSignupSubscriber,
    WorkspaceCreatedSubscriber,
    WorkspaceDeletedSubscriber,
    GetBuildOrganizationBuildJob,
    DeleteWorkspaceProcessor,
  ],
})
export class WorkspacesModule {}
