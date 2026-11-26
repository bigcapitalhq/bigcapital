import { Body, Controller, Get, Put, UseGuards } from '@nestjs/common';
import {
  ApiHeader,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { AuthorizationGuard } from '@/modules/Roles/Authorization.guard';
import { PermissionGuard } from '@/modules/Roles/Permission.guard';
import { RequirePermission } from '@/modules/Roles/RequirePermission.decorator';
import { TenancyContext } from '@/modules/Tenancy/TenancyContext.service';
import { JwtAuthGuard } from '@/modules/Auth/guards/jwt.guard';
import {
  SamlSettingsResponseDto,
  UpdateSamlSettingsDto,
} from './SamlSettings.dto';
import { SamlSettingsService } from './SamlSettings.service';

@Controller('/organization/saml')
@ApiTags('Organization')
@ApiHeader({
  name: 'Authorization',
  required: true,
  description: 'Bearer JWT from an administrator session.',
})
@ApiHeader({
  name: 'organization-id',
  required: true,
  description: 'The organization whose SAML settings to manage.',
})
@UseGuards(JwtAuthGuard, AuthorizationGuard, PermissionGuard)
@RequirePermission('manage', 'all')
export class OrganizationSamlController {
  constructor(
    private readonly settings: SamlSettingsService,
    private readonly tenancy: TenancyContext,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Get SAML settings for the current organization' })
  @ApiOkResponse({ type: SamlSettingsResponseDto })
  async get(): Promise<SamlSettingsResponseDto> {
    return this.settings.get(await this.tenancy.getTenant());
  }

  @Put()
  @ApiOperation({
    summary: 'Update SAML settings for the current organization',
  })
  @ApiOkResponse({ type: SamlSettingsResponseDto })
  async update(
    @Body() body: UpdateSamlSettingsDto,
  ): Promise<SamlSettingsResponseDto> {
    return this.settings.update(await this.tenancy.getTenant(), body);
  }
}
