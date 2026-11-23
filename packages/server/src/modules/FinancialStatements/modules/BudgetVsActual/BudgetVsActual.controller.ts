import { Response } from 'express';
import {
  Controller,
  Get,
  Headers,
  Query,
  Res,
  UseGuards,
} from '@nestjs/common';
import {
  ApiExtraModels,
  ApiOperation,
  ApiProduces,
  ApiQuery,
  ApiResponse,
  ApiTags,
  getSchemaPath,
} from '@nestjs/swagger';
import { AcceptType } from '@/constants/accept-type';
import { ApiCommonHeaders } from '@/common/decorators/ApiCommonHeaders';
import { RequirePermission } from '@/modules/Roles/RequirePermission.decorator';
import { PermissionGuard } from '@/modules/Roles/Permission.guard';
import { AuthorizationGuard } from '@/modules/Roles/Authorization.guard';
import { AbilitySubject } from '@/modules/Roles/Roles.types';
import { NumberFormatQueryDto } from '@/modules/BankingTransactions/dtos/NumberFormatQuery.dto';
import { ReportsAction } from '../../types/Report.types';
import { BudgetVsActualApplication } from './BudgetVsActualApplication';
import { BudgetVsActualQueryDto } from './BudgetVsActualQuery.dto';
import { BudgetVsActualResponseExample } from './BudgetVsActual.swagger';
import {
  BudgetVsActualResponseDto,
  BudgetVsActualTableResponseDto,
} from './BudgetVsActualResponse.dto';

@Controller('/reports/budget-vs-actual')
@ApiTags('Reports')
@ApiCommonHeaders()
@UseGuards(AuthorizationGuard, PermissionGuard)
@ApiExtraModels(
  BudgetVsActualResponseDto,
  BudgetVsActualTableResponseDto,
  NumberFormatQueryDto,
)
export class BudgetVsActualController {
  constructor(private readonly budgetVsActualApp: BudgetVsActualApplication) {}

  /**
   * Retrieves the budget vs actual report.
   * @param {BudgetVsActualQueryDto} query
   * @param {Response} res
   * @param {string} acceptHeader
   */
  @Get('/')
  @RequirePermission(ReportsAction.READ_BUDGET_VS_ACTUAL, AbilitySubject.Report)
  @ApiResponse({
    status: 200,
    description: 'Budget vs actual report',
    content: {
      [AcceptType.ApplicationJson]: {
        schema: { $ref: getSchemaPath(BudgetVsActualResponseDto) },
        example: BudgetVsActualResponseExample,
      },
      [AcceptType.ApplicationJsonTable]: {
        schema: { $ref: getSchemaPath(BudgetVsActualTableResponseDto) },
      },
    },
  })
  @ApiOperation({ summary: 'Get budget vs actual report' })
  @ApiQuery({
    name: 'numberFormat',
    required: false,
    description:
      'Number formatting options (serialized as bracket notation, e.g. numberFormat[precision]=2)',
    schema: { $ref: getSchemaPath(NumberFormatQueryDto) },
  })
  @ApiProduces(
    AcceptType.ApplicationJson,
    AcceptType.ApplicationJsonTable,
    AcceptType.ApplicationPdf,
    AcceptType.ApplicationXlsx,
    AcceptType.ApplicationCsv,
  )
  async budgetVsActual(
    @Query() query: BudgetVsActualQueryDto,
    @Res({ passthrough: true }) res: Response,
    @Headers('accept') acceptHeader: string,
  ) {
    const accept = acceptHeader || '';
    // Retrieves the csv format.
    if (accept.includes(AcceptType.ApplicationCsv)) {
      const sheet = await this.budgetVsActualApp.csv(query);

      res.setHeader('Content-Disposition', 'attachment; filename=output.csv');
      res.setHeader('Content-Type', 'text/csv');

      res.send(sheet);
      // Retrieves the json table format.
    } else if (accept.includes(AcceptType.ApplicationJsonTable)) {
      return this.budgetVsActualApp.table(query);

      // Retrieves the xlsx format.
    } else if (accept.includes(AcceptType.ApplicationXlsx)) {
      const sheet = await this.budgetVsActualApp.xlsx(query);

      res.setHeader('Content-Disposition', 'attachment; filename=output.xlsx');
      res.setHeader(
        'Content-Type',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      );
      res.send(sheet);
      // Retrieves the json format.
    } else if (accept.includes(AcceptType.ApplicationPdf)) {
      const pdfContent = await this.budgetVsActualApp.pdf(query);

      res.set({
        'Content-Type': 'application/pdf',
        'Content-Length': pdfContent.length,
      });
      res.send(pdfContent);
    } else {
      return this.budgetVsActualApp.sheet(query);
    }
  }
}
