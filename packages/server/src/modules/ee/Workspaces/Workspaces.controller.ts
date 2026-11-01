import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import {
  ApiExtraModels,
  ApiOperation,
  ApiResponse,
  ApiTags,
  getSchemaPath,
} from '@nestjs/swagger';
import { ClsService } from 'nestjs-cls';
import { TenantAgnosticRoute } from '@/modules/Tenancy/TenancyGlobal.guard';
import { IgnoreUserVerifiedRoute } from '@/modules/Auth/guards/EnsureUserVerified.guard';
import { IgnoreTenantInitializedRoute } from '@/modules/Tenancy/EnsureTenantIsInitialized.guard';
import { IgnoreTenantSeededRoute } from '@/modules/Tenancy/EnsureTenantIsSeeded.guards';
import { IgnoreTenantModelsInitialize } from '@/modules/Tenancy/TenancyInitializeModels.guard';
import { CreateWorkspaceService } from './commands/CreateWorkspace.service';
import { DeleteWorkspaceService } from './commands/DeleteWorkspace.service';
import { DeleteWorkspaceJobService } from './commands/DeleteWorkspaceJob.service';
import { InactivateWorkspaceService } from './commands/InactivateWorkspace.service';
import { SetDefaultWorkspaceService } from './commands/SetDefaultWorkspace.service';
import { GetWorkspacesService } from './queries/GetWorkspaces.service';
import { GetWorkspaceBuildJobService } from './queries/GetWorkspaceBuildJob.service';
import { CreateWorkspaceDto } from './dtos/CreateWorkspace.dto';
import { SetDefaultWorkspaceDto } from './dtos/SetDefaultWorkspace.dto';
import {
  CreateWorkspaceResponseDto,
  WorkspaceDto,
} from './dtos/WorkspaceResponse.dto';
import { WorkspaceBuildJobResponseDto } from './dtos/WorkspaceBuildJobResponse.dto';
import { ServiceError } from '@/modules/Items/ServiceError';
import { WorkspacesError } from './Workspaces.constants';

@ApiTags('Workspaces')
@Controller('workspaces')
@ApiExtraModels(
  WorkspaceDto,
  CreateWorkspaceResponseDto,
  WorkspaceBuildJobResponseDto,
)
export class WorkspacesController {
  constructor(
    private readonly createWorkspaceService: CreateWorkspaceService,
    private readonly deleteWorkspaceService: DeleteWorkspaceService,
    private readonly deleteWorkspaceJobService: DeleteWorkspaceJobService,
    private readonly inactivateWorkspaceService: InactivateWorkspaceService,
    private readonly setDefaultWorkspaceService: SetDefaultWorkspaceService,
    private readonly getWorkspacesService: GetWorkspacesService,
    private readonly getWorkspaceBuildJobService: GetWorkspaceBuildJobService,
    private readonly cls: ClsService,
  ) {}

  /**
   * Lists all organizations the authenticated user belongs to.
   * No `organization-id` header required.
   */
  @Get()
  @TenantAgnosticRoute()
  @IgnoreUserVerifiedRoute()
  @ApiOperation({
    summary: 'List workspaces the authenticated user belongs to',
  })
  @ApiResponse({
    status: 200,
    description: 'Returns the list of workspaces',
    schema: {
      type: 'array',
      items: { $ref: getSchemaPath(WorkspaceDto) },
    },
  })
  async listWorkspaces(
    @Query('includeInactive') includeInactive?: string,
    @Query('currentOrganizationId') currentOrganizationId?: string,
  ): Promise<WorkspaceDto[]> {
    const userId = this.cls.get<number>('userId');
    return this.getWorkspacesService.getWorkspaces(
      userId,
      includeInactive === 'true',
      currentOrganizationId,
    );
  }

  /**
   * Creates a new workspace (organization) for the authenticated user.
   * The organization database is built asynchronously via a background job.
   * No `organization-id` header required.
   */
  @Post()
  @TenantAgnosticRoute()
  @IgnoreUserVerifiedRoute()
  @HttpCode(200)
  @ApiOperation({ summary: 'Create a new workspace' })
  @ApiResponse({
    status: 200,
    description: 'Returns the created workspace details',
    schema: {
      $ref: getSchemaPath(CreateWorkspaceResponseDto),
    },
  })
  async createWorkspace(
    @Body() dto: CreateWorkspaceDto,
  ): Promise<CreateWorkspaceResponseDto> {
    const userId = this.cls.get<number>('userId');
    return this.createWorkspaceService.createWorkspace(userId, dto);
  }

  /**
   * Deletes a workspace. Only the workspace owner is permitted to delete it.
   * The deletion runs asynchronously via a background job.
   * Requires `organization-id` header (must match the path param).
   */
  @Delete(':organizationId')
  @IgnoreTenantInitializedRoute()
  @IgnoreTenantSeededRoute()
  @IgnoreTenantModelsInitialize()
  @HttpCode(200)
  @ApiOperation({ summary: 'Delete a workspace (owner only)' })
  @ApiResponse({
    status: 200,
    description: 'Workspace deletion initiated successfully',
    schema: {
      properties: {
        jobId: { type: 'string' },
        organizationId: { type: 'string' },
      },
    },
  })
  async deleteWorkspace(
    @Param('organizationId') organizationId: string,
  ): Promise<{ jobId: string | number; organizationId: string }> {
    const userId = this.cls.get<number>('userId');
    const currentOrganizationId = this.cls.get<string>('organizationId');

    if (organizationId === currentOrganizationId) {
      throw new ServiceError(
        WorkspacesError.CANNOT_DELETE_CURRENT_ORGANIZATION,
        'Cannot delete the current organization',
      );
    }
    return this.deleteWorkspaceJobService.initiateDelete(
      userId,
      organizationId,
    );
  }

  /**
   * Inactivates a workspace. Only the workspace owner is permitted to inactivate it.
   * When inactivated, no one can sign in to the workspace until it's reactivated.
   * Requires `organization-id` header (must match the path param).
   */
  @Put(':organizationId/inactivate')
  @IgnoreTenantInitializedRoute()
  @IgnoreTenantSeededRoute()
  @IgnoreTenantModelsInitialize()
  @HttpCode(200)
  @ApiOperation({ summary: 'Inactivate a workspace (owner only)' })
  @ApiResponse({
    status: 200,
    description: 'Workspace inactivated successfully',
  })
  async inactivateWorkspace(
    @Param('organizationId') organizationId: string,
  ): Promise<void> {
    const userId = this.cls.get<number>('userId');
    return this.inactivateWorkspaceService.inactivateWorkspace(
      userId,
      organizationId,
    );
  }

  /**
   * Reactivates a workspace. Only the workspace owner is permitted to reactivate it.
   * Once reactivated, users can sign in again.
   * Requires `organization-id` header (must match the path param).
   */
  @Put(':organizationId/activate')
  @IgnoreTenantInitializedRoute()
  @IgnoreTenantSeededRoute()
  @IgnoreTenantModelsInitialize()
  @HttpCode(200)
  @ApiOperation({ summary: 'Reactivate a workspace (owner only)' })
  @ApiResponse({
    status: 200,
    description: 'Workspace reactivated successfully',
  })
  async activateWorkspace(
    @Param('organizationId') organizationId: string,
  ): Promise<void> {
    const userId = this.cls.get<number>('userId');
    return this.inactivateWorkspaceService.activateWorkspace(
      userId,
      organizationId,
    );
  }

  /**
   * Polls the build job status for a workspace being provisioned.
   * No `organization-id` header required.
   */
  @Get('build/:buildJobId')
  @TenantAgnosticRoute()
  @ApiOperation({ summary: 'Get workspace build job status' })
  @ApiResponse({
    status: 200,
    description: 'Returns the workspace build job details',
    schema: {
      $ref: getSchemaPath(WorkspaceBuildJobResponseDto),
    },
  })
  async buildJobStatus(
    @Param('buildJobId') buildJobId: string,
  ): Promise<WorkspaceBuildJobResponseDto> {
    return this.getWorkspaceBuildJobService.getJobDetails(buildJobId);
  }

  /**
   * Sets the given organization as the user's default workspace.
   * No `organization-id` header required.
   */
  @Put('default')
  @TenantAgnosticRoute()
  @IgnoreUserVerifiedRoute()
  @HttpCode(200)
  @ApiOperation({ summary: 'Set default workspace' })
  @ApiResponse({
    status: 200,
    description: 'Default workspace set successfully',
  })
  async setDefaultWorkspace(
    @Body() dto: SetDefaultWorkspaceDto,
  ): Promise<void> {
    const userId = this.cls.get<number>('userId');
    return this.setDefaultWorkspaceService.setDefaultWorkspace(
      userId,
      dto.organizationId,
    );
  }
}
