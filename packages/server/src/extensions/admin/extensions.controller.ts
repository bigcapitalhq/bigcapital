import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ClsService } from 'nestjs-cls';
import { ApiCommonHeaders } from '../../common/decorators/ApiCommonHeaders';
import { AuthorizationGuard } from '../../modules/Roles/Authorization.guard';
import { PermissionGuard } from '../../modules/Roles/Permission.guard';
import { RequirePermission } from '../../modules/Roles/RequirePermission.decorator';
import {
  AbilitySubject,
  ExtensionsAction,
} from '../../modules/Roles/Roles.types';
import { ExtensionManager } from '../extension.manager';
import { ExtensionContributionRegistry } from '../extension.registry';
import { ExtensionMigrationService } from '../migrations/extension-migration.service';
import {
  ExtensionSettingsService,
  ExtensionSettingsValidationError,
} from '../settings/extension-settings.service';

/**
 * Tenant-scoped extension administration.
 *
 * All routes require an authenticated user and the `Extensions` ability.
 */
@ApiTags('Extensions')
@Controller('extensions')
@ApiCommonHeaders()
@UseGuards(AuthorizationGuard, PermissionGuard)
export class ExtensionsController {
  constructor(
    private readonly manager: ExtensionManager,
    private readonly registry: ExtensionContributionRegistry,
    private readonly settings: ExtensionSettingsService,
    private readonly migrations: ExtensionMigrationService,
    private readonly cls: ClsService,
  ) {}

  @Get()
  @RequirePermission(ExtensionsAction.View, AbilitySubject.Extensions)
  @ApiOperation({ summary: 'List installed extensions for the tenant' })
  async list() {
    const organizationId = this.getOrganizationId();
    const extensions = await this.manager.listForOrganization(organizationId);

    return extensions.map((extension) => ({
      ...extension,
      settings: this.settings.getAdminSettingsOrStored(
        extension.id,
        extension.settings,
      ),
    }));
  }

  @Get(':id')
  @RequirePermission(ExtensionsAction.View, AbilitySubject.Extensions)
  @ApiOperation({ summary: 'Retrieve one installed extension' })
  async get(@Param('id') extensionId: string) {
    const organizationId = this.getOrganizationId();
    const extension = await this.manager.getExtension(extensionId);
    const record = await this.manager.getTenantRecord(
      extensionId,
      organizationId,
    );
    const manifest = this.registry.getManifest(extensionId);

    return {
      id: extension.extensionId,
      name: extension.name,
      version: extension.version,
      trust: extension.trust,
      status: extension.status,
      description: manifest?.description,
      enabled: await this.manager.isEnabled(extensionId, organizationId),
      tenantStatus: record?.status,
      tenantVersion: record?.version,
      lastError: record?.lastError,
      settings: this.settings.getAdminSettingsOrStored(
        extensionId,
        record?.settings,
      ),
      migrations: manifest?.migrations ?? null,
    };
  }

  @Post(':id/enable')
  @RequirePermission(ExtensionsAction.Manage, AbilitySubject.Extensions)
  @ApiOperation({
    summary: 'Run tenant migrations and enable an extension',
  })
  async enable(@Param('id') extensionId: string) {
    const organizationId = this.getOrganizationId();

    await this.manager.ensureTenantRecord(extensionId, organizationId);
    await this.migrations.migrate(extensionId, organizationId);
    const record = await this.manager.enable(extensionId, organizationId);

    return {
      data: record,
      message: `Extension "${extensionId}" has been enabled.`,
    };
  }

  @Post(':id/disable')
  @RequirePermission(ExtensionsAction.Manage, AbilitySubject.Extensions)
  @ApiOperation({ summary: 'Disable an extension without deleting its data' })
  async disable(@Param('id') extensionId: string) {
    const organizationId = this.getOrganizationId();
    const record = await this.manager.disable(extensionId, organizationId);

    return {
      data: record,
      message: `Extension "${extensionId}" has been disabled.`,
    };
  }

  @Get(':id/settings')
  @RequirePermission(ExtensionsAction.View, AbilitySubject.Extensions)
  @ApiOperation({ summary: 'Retrieve extension settings with secrets masked' })
  async getSettings(@Param('id') extensionId: string) {
    const organizationId = this.getOrganizationId();

    return this.settings.getAdminSettingsForOrganization(
      extensionId,
      organizationId,
    );
  }

  @Put(':id/settings')
  @RequirePermission(ExtensionsAction.Manage, AbilitySubject.Extensions)
  @ApiOperation({ summary: 'Update extension settings' })
  @ApiBody({
    schema: {
      type: 'object',
      additionalProperties: true,
    },
  })
  async updateSettings(
    @Param('id') extensionId: string,
    @Body() body: Record<string, unknown>,
  ) {
    const organizationId = this.getOrganizationId();

    try {
      const settings = await this.settings.updateSettings(
        extensionId,
        organizationId,
        body,
      );

      return {
        data: settings,
        message: 'Extension settings have been updated.',
      };
    } catch (error) {
      if (error instanceof ExtensionSettingsValidationError) {
        throw new BadRequestException(error.issues);
      }

      throw error;
    }
  }

  @Post(':id/migrate')
  @RequirePermission(ExtensionsAction.Manage, AbilitySubject.Extensions)
  @ApiOperation({ summary: 'Run the extension tenant migrations' })
  async migrate(@Param('id') extensionId: string) {
    const organizationId = this.getOrganizationId();
    const result = await this.migrations.migrate(extensionId, organizationId);

    return {
      data: result,
      message: `Extension "${extensionId}" migrations are up to date.`,
    };
  }

  @Get(':id/health')
  @RequirePermission(ExtensionsAction.View, AbilitySubject.Extensions)
  @ApiOperation({ summary: 'Retrieve extension tenant health' })
  async health(@Param('id') extensionId: string) {
    const organizationId = this.getOrganizationId();

    return this.migrations.getHealth(extensionId, organizationId);
  }

  private getOrganizationId(): string {
    const organizationId = this.cls.get<string>('organizationId');

    if (!organizationId) {
      throw new BadRequestException('The organization-id header is required.');
    }

    return organizationId;
  }
}
