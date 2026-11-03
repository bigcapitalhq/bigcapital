import {
  Body,
  Controller,
  Get,
  HttpCode,
  Put,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBody,
  ApiExtraModels,
  ApiOperation,
  ApiResponse,
  ApiTags,
  getSchemaPath,
} from '@nestjs/swagger';
import { ClsService } from 'nestjs-cls';
import { TenancyContext } from '@/modules/Tenancy/TenancyContext.service';
import { AuthorizationGuard } from '@/modules/Roles/Authorization.guard';
import { PermissionGuard } from '@/modules/Roles/Permission.guard';
import { RequirePermission } from '@/modules/Roles/RequirePermission.decorator';
import { ServiceError } from '@/modules/Items/ServiceError';
import { ApiCommonHeaders } from '@/common/decorators/ApiCommonHeaders';
import { TwoFactorPolicyService } from './TwoFactorPolicy.service';
import { TwoFactorService } from './TwoFactor.service';
import { RejectApiKeyGuard } from './RejectApiKey.guard';
import {
  AllowWithoutTwoFactor,
  TWO_FACTOR_ERRORS,
} from './TwoFactor.constants';
import {
  OrganizationTwoFactorDto,
  OrganizationTwoFactorResponseDto,
} from './dtos/TwoFactor.dto';

/**
 * The organization setting "require two-factor authentication for all users".
 */
@Controller('/organization/two-factor')
@ApiTags('Organization')
@ApiExtraModels(OrganizationTwoFactorResponseDto)
@ApiCommonHeaders()
@UseGuards(AuthorizationGuard, PermissionGuard)
export class OrganizationTwoFactorController {
  constructor(
    private readonly policyService: TwoFactorPolicyService,
    private readonly twoFactorService: TwoFactorService,
    private readonly tenancyContext: TenancyContext,
    private readonly clsService: ClsService,
  ) {}

  @Get()
  @AllowWithoutTwoFactor()
  @ApiOperation({
    summary: 'Whether the organization requires two-factor authentication',
  })
  @ApiResponse({
    status: 200,
    schema: { $ref: getSchemaPath(OrganizationTwoFactorResponseDto) },
  })
  async get(): Promise<OrganizationTwoFactorResponseDto> {
    const tenant = await this.tenancyContext.getTenant();
    const required = await this.policyService.isRequiredForTenant(tenant.id);

    return { required };
  }

  @Put()
  @HttpCode(200)
  @UseGuards(RejectApiKeyGuard)
  @RequirePermission('manage', 'all')
  @ApiOperation({
    summary:
      'Require two-factor authentication for all users (administrators only)',
  })
  @ApiBody({ type: OrganizationTwoFactorDto })
  @ApiResponse({
    status: 200,
    schema: { $ref: getSchemaPath(OrganizationTwoFactorResponseDto) },
  })
  async update(
    @Body() body: OrganizationTwoFactorDto,
  ): Promise<OrganizationTwoFactorResponseDto> {
    const userId = this.clsService.get<number>('userId');

    // Turning it on without two-factor of one's own would end the session.
    if (body.required && !(await this.twoFactorService.isEnabled(userId))) {
      throw new ServiceError(
        TWO_FACTOR_ERRORS.ENABLE_OWN_FIRST,
        'Turn on two-factor authentication for your own account first.',
      );
    }
    const tenant = await this.tenancyContext.getTenant();

    await this.policyService.setRequired(
      tenant.id,
      tenant.organizationId,
      body.required,
    );
    return { required: !!body.required };
  }
}
