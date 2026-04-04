import { Response } from 'express';
import {
  Controller,
  Get,
  Headers,
  Query,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ProfitLossSheetApplication } from './ProfitLossSheetApplication';
import { AcceptType } from '@/constants/accept-type';
import {
  ApiExtraModels,
  ApiOperation,
  ApiProduces,
  ApiResponse,
  ApiTags,
  getSchemaPath,
} from '@nestjs/swagger';
import { ProfitLossSheetQueryDto } from './ProfitLossSheetQuery.dto';
import { ProfitLossSheetResponseExample } from './ProfitLossSheet.swagger';
import {
  ProfitLossSheetResponseDto,
  ProfitLossSheetTableResponseDto,
} from './ProfitLossSheetResponse.dto';
import { ApiCommonHeaders } from '@/common/decorators/ApiCommonHeaders';
import { RequirePermission } from '@/modules/Roles/RequirePermission.decorator';
import { PermissionGuard } from '@/modules/Roles/Permission.guard';
import { AuthorizationGuard } from '@/modules/Roles/Authorization.guard';
import { AbilitySubject } from '@/modules/Roles/Roles.types';
import { ReportsAction } from '../../types/Report.types';

@Controller('/reports/profit-loss-sheet')
@ApiTags('Reports')
@ApiCommonHeaders()
@UseGuards(AuthorizationGuard, PermissionGuard)
@ApiExtraModels(ProfitLossSheetResponseDto, ProfitLossSheetTableResponseDto)
export class ProfitLossSheetController {
  constructor(
    private readonly profitLossSheetApp: ProfitLossSheetApplication,
  ) {}

  /**
   * Retrieves the profit/loss sheet.
   * @param {ProfitLossSheetQueryDto} query
   * @param {Response} res
   * @param {string} acceptHeader
   */
  @Get('/')
  @RequirePermission(ReportsAction.READ_PROFIT_LOSS, AbilitySubject.Report)
  @ApiResponse({
    status: 200,
    description: 'Profit & loss statement',
    content: {
      [AcceptType.ApplicationJson]: {
        schema: { $ref: getSchemaPath(ProfitLossSheetResponseDto) },
        example: ProfitLossSheetResponseExample,
      },
      [AcceptType.ApplicationJsonTable]: {
        schema: { $ref: getSchemaPath(ProfitLossSheetTableResponseDto) },
      },
    },
  })
  @ApiOperation({ summary: 'Get profit/loss statement report' })
  @ApiProduces(
    AcceptType.ApplicationJson,
    AcceptType.ApplicationJsonTable,
    AcceptType.ApplicationPdf,
    AcceptType.ApplicationXlsx,
    AcceptType.ApplicationCsv,
  )
  async profitLossSheet(
    @Query() query: ProfitLossSheetQueryDto,
    @Res({ passthrough: true }) res: Response,
    @Headers('accept') acceptHeader: string,
  ) {
    const accept = acceptHeader || '';
    // Retrieves the csv format.
    if (accept.includes(AcceptType.ApplicationCsv)) {
      const sheet = await this.profitLossSheetApp.csv(query);

      res.setHeader('Content-Disposition', 'attachment; filename=output.csv');
      res.setHeader('Content-Type', 'text/csv');

      res.send(sheet);
      // Retrieves the json table format.
    } else if (accept.includes(AcceptType.ApplicationJsonTable)) {
      return this.profitLossSheetApp.table(query);

      // Retrieves the xlsx format.
    } else if (accept.includes(AcceptType.ApplicationXlsx)) {
      const sheet = await this.profitLossSheetApp.xlsx(query);

      res.setHeader('Content-Disposition', 'attachment; filename=output.xlsx');
      res.setHeader(
        'Content-Type',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      );
      res.send(sheet);
      // Retrieves the json format.
    } else if (accept.includes(AcceptType.ApplicationPdf)) {
      const pdfContent = await this.profitLossSheetApp.pdf(query);

      res.set({
        'Content-Type': 'application/pdf',
        'Content-Length': pdfContent.length,
      });
      res.send(pdfContent);
    } else {
      return this.profitLossSheetApp.sheet(query);
    }
  }
}
