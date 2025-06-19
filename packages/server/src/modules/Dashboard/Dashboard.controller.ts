import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  getSchemaPath,
  ApiExtraModels,
} from '@nestjs/swagger';
import { Controller, Get } from '@nestjs/common';
import { DashboardService } from './Dashboard.service';
import { GetDashboardBootMetaResponseDto } from './dtos/GetDashboardBootMetaResponse.dto';

@ApiTags('Dashboard')
@Controller('dashboard')
@ApiExtraModels(GetDashboardBootMetaResponseDto)
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @ApiOperation({ summary: 'Get dashboard boot metadata' })
  @ApiResponse({
    status: 200,
    description: 'The dashboard details have been successfully retrieved.',
    schema: { $ref: getSchemaPath(GetDashboardBootMetaResponseDto) },
  })
  @Get('boot')
  getBootMeta() {
    return this.dashboardService.getBootMeta();
  }
}
