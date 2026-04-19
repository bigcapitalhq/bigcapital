import {
  Controller,
  Get,
  Query,
  Res,
  Headers,
  UseGuards,
} from '@nestjs/common';
import { BudgetVsActualApplication } from './BudgetVsActualApplication';
import { BudgetVsActualQueryDto } from './BudgetVsActualQuery.dto';
import {
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { BudgetVsActualResponseDto } from './BudgetVsActualResponse.dto';
import { RequirePermission } from '@/modules/Roles/RequirePermission.decorator';
import { PermissionGuard } from '@/modules/Roles/Permission.guard';
import { AuthorizationGuard } from '@/modules/Roles/Authorization.guard';
import { AbilitySubject } from '@/modules/Roles/Roles.types';
import { ReportsAction } from '../../types/Report.types';
import { Response } from 'express';

@Controller('/reports/budget-vs-actual')
@ApiTags('Reports')
@UseGuards(AuthorizationGuard, PermissionGuard)
export class BudgetVsActualController {
  constructor(
    private readonly budgetVsActualApp: BudgetVsActualApplication,
  ) {}

  @Get('/')
  @RequirePermission(ReportsAction.READ_BUDGET_VS_ACTUAL, AbilitySubject.Report)
  @ApiOperation({ summary: 'Retrieves the Budget vs Actual report.' })
  @ApiResponse({
    status: 200,
    description: 'The Budget vs Actual report has been successfully retrieved.',
  })
  async budgetVsActual(
    @Query() query: BudgetVsActualQueryDto,
    @Res({ passthrough: true }) res: Response,
    @Headers('accept') acceptHeader: string,
  ) {
    if (acceptHeader === 'application/csv') {
      return this.budgetVsActualApp.csv(query);
    }
    if (acceptHeader === 'application/json+table') {
      return this.budgetVsActualApp.table(query);
    }
    if (
      acceptHeader ===
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    ) {
      return this.budgetVsActualApp.xlsx(query);
    }
    if (acceptHeader === 'application/pdf') {
      return this.budgetVsActualApp.pdf(query);
    }
    return this.budgetVsActualApp.sheet(query);
  }
}
