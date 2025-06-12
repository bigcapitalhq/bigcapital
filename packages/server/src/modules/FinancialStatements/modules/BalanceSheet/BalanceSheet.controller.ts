import { Response } from 'express';
import { Controller, Get, Headers, Query, Res } from '@nestjs/common';
import { AcceptType } from '@/constants/accept-type';
import { BalanceSheetApplication } from './BalanceSheetApplication';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { BalanceSheetQueryDto } from './BalanceSheet.dto';

@Controller('/reports/balance-sheet')
@ApiTags('Reports')
export class BalanceSheetStatementController {
  constructor(private readonly balanceSheetApp: BalanceSheetApplication) {}

  /**
   * Retrieve the balance sheet.
   * @param {BalanceSheetQueryDto} query - Balance sheet query.
   * @param {Response} res - Response.
   * @param {string} acceptHeader - Accept header.
   */
  @Get('')
  @ApiOperation({ summary: 'Get balance sheet statement' })
  @ApiResponse({ status: 200, description: 'Balance sheet statement' })
  public async balanceSheet(
    @Query() query: BalanceSheetQueryDto,
    @Res({ passthrough: true }) res: Response,
    @Headers('accept') acceptHeader: string,
  ) {
    // Retrieves the json table format.
    if (acceptHeader.includes(AcceptType.ApplicationJsonTable)) {
      const table = await this.balanceSheetApp.table(query);

      return table;
      // Retrieves the csv format.
    } else if (acceptHeader.includes(AcceptType.ApplicationCsv)) {
      const buffer = await this.balanceSheetApp.csv(query);

      res.setHeader('Content-Disposition', 'attachment; filename=output.csv');
      res.setHeader('Content-Type', 'text/csv');

      res.send(buffer);
      // Retrieves the xlsx format.
    } else if (acceptHeader.includes(AcceptType.ApplicationXlsx)) {
      const buffer = await this.balanceSheetApp.xlsx(query);

      res.setHeader('Content-Disposition', 'attachment; filename=output.xlsx');
      res.setHeader(
        'Content-Type',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      );
      res.send(buffer);
      // Retrieves the pdf format.
    } else if (acceptHeader.includes(AcceptType.ApplicationPdf)) {
      const pdfContent = await this.balanceSheetApp.pdf(query);

      res.set({
        'Content-Type': 'application/pdf',
        'Content-Length': pdfContent.length,
      });
      res.send(pdfContent);
    } else {
      const sheet = await this.balanceSheetApp.sheet(query);

      return sheet;
    }
  }
}
