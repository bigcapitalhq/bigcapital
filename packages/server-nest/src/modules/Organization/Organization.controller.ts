import {
  Controller,
  Post,
  Put,
  Get,
  Body,
  Req,
  Res,
  Next,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { BuildOrganizationService } from './commands/BuildOrganization.service';
import {
  BuildOrganizationDto,
  UpdateOrganizationDto,
} from './dtos/Organization.dto';
import { GetCurrentOrganizationService } from './queries/GetCurrentOrganization.service';
import { UpdateOrganizationService } from './commands/UpdateOrganization.service';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { PublicRoute } from '../Auth/Jwt.guard';

@ApiTags('Organization')
@Controller('organization')
@PublicRoute()
export class OrganizationController {
  constructor(
    private readonly buildOrganizationService: BuildOrganizationService,
    private readonly getCurrentOrgService: GetCurrentOrganizationService,
    private readonly updateOrganizationService: UpdateOrganizationService,
  ) {}

  @Post('build')
  @ApiOperation({ summary: 'Build organization database' })
  @ApiBody({ type: BuildOrganizationDto })
  @ApiResponse({
    status: 200,
    description: 'The organization database has been initialized',
  })
  async build(
    @Body() buildDTO: BuildOrganizationDto,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const result = await this.buildOrganizationService.buildRunJob(buildDTO);

    return res.status(200).send({
      type: 'success',
      code: 'ORGANIZATION.DATABASE.INITIALIZED',
      message: 'The organization database has been initialized.',
      data: result,
    });
  }

  @Get()
  @ApiOperation({ summary: 'Get current organization' })
  @ApiResponse({
    status: 200,
    description: 'Returns the current organization',
  })
  async currentOrganization(
    @Req() req: Request,
    @Res() res: Response,
    @Next() next: NextFunction,
  ) {
    const organization =
      await this.getCurrentOrgService.getCurrentOrganization();

    return res.status(200).send({ organization });
  }

  @Put()
  @ApiOperation({ summary: 'Update organization information' })
  @ApiBody({ type: UpdateOrganizationDto })
  @ApiResponse({
    status: 200,
    description: 'Organization information has been updated successfully',
  })
  async updateOrganization(
    @Body() updateDTO: UpdateOrganizationDto,
    @Res() res: Response,
  ) {
    await this.updateOrganizationService.execute(updateDTO);

    return res.status(200).send({
      code: 200,
      message: 'Organization information has been updated successfully.',
    });
  }
}
