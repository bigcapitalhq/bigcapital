import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Controller, Get } from '@nestjs/common';
import { DashboardService } from './Dashboard.service';

@ApiTags('Dashboard')
@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @ApiOperation({ summary: 'Get dashboard boot metadata' })
  @ApiResponse({
    status: 200,
    description: 'Returns dashboard boot metadata including abilities, features, and cloud status',
  })
  @Get('boot')
  getBootMeta() {
    return this.dashboardService.getBootMeta();
  }
}
