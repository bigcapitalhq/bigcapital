import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiOkResponse,
  ApiExtraModels,
  getSchemaPath,
  ApiParam,
} from '@nestjs/swagger';
import {
  Controller,
  Post,
  Put,
  Get,
  Body,
  HttpCode,
  Param,
} from '@nestjs/common';
import { BuildOrganizationService } from './commands/BuildOrganization.service';
import {
  BuildOrganizationDto,
  UpdateOrganizationDto,
} from './dtos/Organization.dto';
import { GetCurrentOrganizationService } from './queries/GetCurrentOrganization.service';
import { UpdateOrganizationService } from './commands/UpdateOrganization.service';
import { IgnoreTenantInitializedRoute } from '../Tenancy/EnsureTenantIsInitialized.guard';
import { IgnoreTenantSeededRoute } from '../Tenancy/EnsureTenantIsSeeded.guards';
import { IgnoreTenantModelsInitialize } from '../Tenancy/TenancyInitializeModels.guard';
import { GetBuildOrganizationBuildJob } from './commands/GetBuildOrganizationJob.service';
import { OrganizationBaseCurrencyLocking } from './Organization/OrganizationBaseCurrencyLocking.service';
import {
  OrganizationBuildResponseExample,
  OrganizationBuiltResponseExample,
} from './Organization.swagger';
import { GetCurrentOrganizationResponseDto } from './dtos/GetCurrentOrganizationResponse.dto';
import { ApiCommonHeaders } from '@/common/decorators/ApiCommonHeaders';

@ApiTags('Organization')
@Controller('organization')
@IgnoreTenantInitializedRoute()
@IgnoreTenantSeededRoute()
@IgnoreTenantModelsInitialize()
@ApiExtraModels(GetCurrentOrganizationResponseDto)
@ApiCommonHeaders()
export class OrganizationController {
  constructor(
    private readonly buildOrganizationService: BuildOrganizationService,
    private readonly getCurrentOrgService: GetCurrentOrganizationService,
    private readonly updateOrganizationService: UpdateOrganizationService,
    private readonly getBuildOrganizationJobService: GetBuildOrganizationBuildJob,
    private readonly orgBaseCurrencyLockingService: OrganizationBaseCurrencyLocking,
  ) { }

  @Post('build')
  @HttpCode(200)
  @ApiOperation({ summary: 'Build organization database' })
  @ApiBody({ type: BuildOrganizationDto })
  @ApiResponse({
    status: 200,
    description: 'The organization database has been initialized',
    example: OrganizationBuildResponseExample,
  })
  @ApiResponse({
    status: 500,
    example: OrganizationBuiltResponseExample,
  })
  async build(@Body() buildDTO: BuildOrganizationDto) {
    const result = await this.buildOrganizationService.buildRunJob(buildDTO);

    return {
      type: 'success',
      code: 'ORGANIZATION.DATABASE.INITIALIZED',
      message: 'The organization database has been initialized.',
      data: result,
    };
  }

  @Get('build/:buildJobId')
  @ApiParam({
    name: 'buildJobId',
    required: true,
    type: Number,
    description: 'The build job id',
  })
  @HttpCode(200)
  @ApiOperation({ summary: 'Gets the organization build job details' })
  async buildJob(@Param('buildJobId') buildJobId: string) {
    return this.getBuildOrganizationJobService.getJobDetails(buildJobId);
  }

  @Get('current')
  @HttpCode(200)
  @ApiOperation({ summary: 'Get current organization' })
  @ApiResponse({
    status: 200,
    description: 'Returns the current organization',
    schema: {
      $ref: getSchemaPath(GetCurrentOrganizationResponseDto),
    },
  })
  async currentOrganization() {
    const organization =
      await this.getCurrentOrgService.getCurrentOrganization();

    return organization;
  }

  @Get('base-currency-mutate')
  async baseCurrencyMutate() {
    const abilities =
      await this.orgBaseCurrencyLockingService.baseCurrencyMutateLocks();

    return { abilities };
  }

  @Put()
  @HttpCode(200)
  @ApiOperation({ summary: 'Update organization information' })
  @ApiBody({ type: UpdateOrganizationDto })
  @ApiResponse({
    status: 200,
    description: 'Organization information has been updated successfully',
  })
  async updateOrganization(@Body() updateDTO: UpdateOrganizationDto) {
    await this.updateOrganizationService.execute(updateDTO);

    return {
      code: 200,
      message: 'Organization information has been updated successfully.',
    };
  }
}
