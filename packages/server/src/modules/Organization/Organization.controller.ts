import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiOkResponse,
} from '@nestjs/swagger';
import {
  Controller,
  Post,
  Put,
  Get,
  Body,
  Req,
  Res,
  Next,
  HttpCode,
  Param,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { BuildOrganizationService } from './commands/BuildOrganization.service';
import {
  BuildOrganizationDto,
  UpdateOrganizationDto,
} from './dtos/Organization.dto';
import { GetCurrentOrganizationService } from './queries/GetCurrentOrganization.service';
import { UpdateOrganizationService } from './commands/UpdateOrganization.service';
import { IgnoreTenantInitializedRoute } from '../Tenancy/EnsureTenantIsInitialized.guard';
import { IgnoreTenantSeededRoute } from '../Tenancy/EnsureTenantIsSeeded.guards';
import { GetBuildOrganizationBuildJob } from './commands/GetBuildOrganizationJob.service';

@ApiTags('Organization')
@Controller('organization')
@IgnoreTenantInitializedRoute()
@IgnoreTenantSeededRoute()
export class OrganizationController {
  constructor(
    private readonly buildOrganizationService: BuildOrganizationService,
    private readonly getCurrentOrgService: GetCurrentOrganizationService,
    private readonly updateOrganizationService: UpdateOrganizationService,
    private readonly getBuildOrganizationJobService: GetBuildOrganizationBuildJob,
  ) {}

  @Post('build')
  @HttpCode(200)
  @ApiOperation({ summary: 'Build organization database' })
  @ApiBody({ type: BuildOrganizationDto })
  @ApiResponse({
    status: 200,
    description: 'The organization database has been initialized',
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
  })
  async currentOrganization() {
    const organization =
      await this.getCurrentOrgService.getCurrentOrganization();

    return { organization };
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
