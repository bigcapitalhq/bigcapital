import { Controller, Get, Headers, Query, Res } from '@nestjs/common';
import { IJournalReportQuery } from './JournalSheet.types';
import { Response } from 'express';
import { AcceptType } from '@/constants/accept-type';
import { JournalSheetApplication } from './JournalSheetApplication';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { PublicRoute } from '@/modules/Auth/Jwt.guard';

@Controller('/reports/journal')
@ApiTags('reports')
@PublicRoute()
export class JournalSheetController {
  constructor(private readonly journalSheetApp: JournalSheetApplication) {}

  @Get('/')
  @ApiResponse({ status: 200, description: 'Journal report' })
  @ApiOperation({ summary: 'Journal report' })
  async journalSheet(
    @Query() query: IJournalReportQuery,
    @Res() res: Response,
    @Headers('accept') acceptHeader: string,
  ) {
    // Retrieves the json table format.
    if (acceptHeader.includes(AcceptType.ApplicationJsonTable)) {
      const table = await this.journalSheetApp.table(query);
      return res.status(200).send(table);

      // Retrieves the csv format.
    } else if (acceptHeader.includes(AcceptType.ApplicationCsv)) {
      const buffer = await this.journalSheetApp.csv(query);

      res.setHeader('Content-Disposition', 'attachment; filename=output.csv');
      res.setHeader('Content-Type', 'text/csv');

      return res.send(buffer);
      // Retrieves the xlsx format.
    } else if (acceptHeader.includes(AcceptType.ApplicationXlsx)) {
      const buffer = await this.journalSheetApp.xlsx(query);

      res.setHeader('Content-Disposition', 'attachment; filename=output.xlsx');
      res.setHeader(
        'Content-Type',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      );
      return res.send(buffer);
      // Retrieves the json format.
    } else if (acceptHeader.includes(AcceptType.ApplicationPdf)) {
      const pdfContent = await this.journalSheetApp.pdf(query);

      res.set({
        'Content-Type': 'application/pdf',
        'Content-Length': pdfContent.length,
      });
      res.send(pdfContent);
    } else {
      const sheet = await this.journalSheetApp.sheet(query);

      return res.status(200).send(sheet);
    }
  }
}
