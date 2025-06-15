import { Response } from 'express';
import { Controller, Get, Headers, Query, Res } from '@nestjs/common';
import { ProfitLossSheetApplication } from './ProfitLossSheetApplication';
import { AcceptType } from '@/constants/accept-type';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ProfitLossSheetQueryDto } from './ProfitLossSheetQuery.dto';

@Controller('/reports/profit-loss-sheet')
@ApiTags('Reports')
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
  @ApiResponse({ status: 200, description: 'Profit & loss statement' })
  @ApiOperation({ summary: 'Get profit/loss statement report' })
  async profitLossSheet(
    @Query() query: ProfitLossSheetQueryDto,
    @Res({ passthrough: true }) res: Response,
    @Headers('accept') acceptHeader: string,
  ) {
    // Retrieves the csv format.
    if (acceptHeader.includes(AcceptType.ApplicationCsv)) {
      const sheet = await this.profitLossSheetApp.csv(query);

      res.setHeader('Content-Disposition', 'attachment; filename=output.csv');
      res.setHeader('Content-Type', 'text/csv');

      res.send(sheet);
      // Retrieves the json table format.
    } else if (acceptHeader.includes(AcceptType.ApplicationJsonTable)) {
      return this.profitLossSheetApp.table(query);

      // Retrieves the xlsx format.
    } else if (acceptHeader.includes(AcceptType.ApplicationXlsx)) {
      const sheet = await this.profitLossSheetApp.xlsx(query);

      res.setHeader('Content-Disposition', 'attachment; filename=output.xlsx');
      res.setHeader(
        'Content-Type',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      );
      res.send(sheet);
      // Retrieves the json format.
    } else if (acceptHeader.includes(AcceptType.ApplicationPdf)) {
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
