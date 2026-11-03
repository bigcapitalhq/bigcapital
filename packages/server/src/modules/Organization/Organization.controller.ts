import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiExtraModels,
  getSchemaPath,
  ApiParam,
} from '@nestjs/swagger';
import { Controller, Post, Put, Get, HttpCode, Param } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
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
import { IgnoreUserVerifiedRoute } from '../Auth/guards/EnsureUserVerified.guard';
import { GetBuildOrganizationBuildJob } from './commands/GetBuildOrganizationJob.service';
import { OrganizationBaseCurrencyLocking } from './Organization/OrganizationBaseCurrencyLocking.service';
import {
  OrganizationBuildResponseExample,
  OrganizationBuiltResponseExample,
} from './Organization.swagger';
import { GetCurrentOrganizationResponseDto } from './dtos/GetCurrentOrganizationResponse.dto';
import { OrganizationBuildJobResponseDto } from './dtos/OrganizationBuildJobResponse.dto';
import { ApiCommonHeaders } from '@/common/decorators/ApiCommonHeaders';
import { SnakeCaseBody } from '@/common/decorators/SnakeCaseBody';
import { OrgBaseCurrencyMutateAbilitiesResponseDto } from './dtos/OrgBaseCurrencyMutateAbilitiesResponse.dto';

@ApiTags('Organization')
@Controller('organization')
@IgnoreTenantInitializedRoute()
@IgnoreTenantSeededRoute()
@IgnoreTenantModelsInitialize()
@ApiExtraModels(GetCurrentOrganizationResponseDto)
@ApiExtraModels(OrganizationBuildJobResponseDto)
@ApiExtraModels(OrgBaseCurrencyMutateAbilitiesResponseDto)
@ApiCommonHeaders()
export class OrganizationController {
  constructor(
    private readonly buildOrganizationService: BuildOrganizationService,
    private readonly getCurrentOrgService: GetCurrentOrganizationService,
    private readonly updateOrganizationService: UpdateOrganizationService,
    private readonly getBuildOrganizationJobService: GetBuildOrganizationBuildJob,
    private readonly orgBaseCurrencyLockingService: OrganizationBaseCurrencyLocking,
  ) {}

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
  async build(@SnakeCaseBody() buildDTO: BuildOrganizationDto) {
    const result = await this.buildOrganizationService.buildRunJob(buildDTO);

    return {
      type: 'success',
      code: 'ORGANIZATION.DATABASE.INITIALIZED',
      message: 'The organization database has been initialized.',
      data: result,
    };
  }

  @Get('build/:buildJobId')
  @Throttle({ default: { limit: 300, ttl: 60000 } }) // 300 req/min
  @ApiParam({
    name: 'buildJobId',
    required: true,
    type: Number,
    description: 'The build job id',
  })
  @HttpCode(200)
  @ApiOperation({ summary: 'Gets the organization build job details' })
  @ApiResponse({
    status: 200,
    description: 'Returns the organization build job details',
    schema: {
      $ref: getSchemaPath(OrganizationBuildJobResponseDto),
    },
  })
  async buildJob(@Param('buildJobId') buildJobId: string) {
    return this.getBuildOrganizationJobService.getJobDetails(buildJobId);
  }

  @Get('current')
  @HttpCode(200)
  @IgnoreUserVerifiedRoute()
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
  @ApiOperation({
    summary: 'Retrieves the base currency mutation lock abilities.',
  })
  @ApiResponse({
    status: 200,
    description: 'The base currency mutation abilities.',
    schema: { $ref: getSchemaPath(OrgBaseCurrencyMutateAbilitiesResponseDto) },
  })
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
  async updateOrganization(@SnakeCaseBody() updateDTO: UpdateOrganizationDto) {
    await this.updateOrganizationService.execute(updateDTO);

    return {
      code: 200,
      message: 'Organization information has been updated successfully.',
    };
  }
}
