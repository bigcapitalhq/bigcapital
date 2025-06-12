import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { Controller, Get, Headers, Query, Res } from '@nestjs/common';
import { GeneralLedgerApplication } from './GeneralLedgerApplication';
import { AcceptType } from '@/constants/accept-type';
import { GeneralLedgerQueryDto } from './GeneralLedgerQuery.dto';

@Controller('/reports/general-ledger')
@ApiTags('Reports')
export class GeneralLedgerController {
  constructor(
    private readonly generalLedgerApplication: GeneralLedgerApplication,
  ) {}

  @Get()
  @ApiResponse({ status: 200, description: 'General ledger report' })
  @ApiOperation({ summary: 'Get general ledger report' })
  public async getGeneralLedger(
    @Query() query: GeneralLedgerQueryDto,
    @Res({ passthrough: true }) res: Response,
    @Headers('accept') acceptHeader: string,
  ) {
    // Retrieves the table format.
    if (acceptHeader.includes(AcceptType.ApplicationJsonTable)) {
      return this.generalLedgerApplication.table(query);
      // Retrieves the csv format.
    } else if (acceptHeader.includes(AcceptType.ApplicationCsv)) {
      const buffer = await this.generalLedgerApplication.csv(query);

      res.setHeader('Content-Disposition', 'attachment; filename=output.csv');
      res.setHeader('Content-Type', 'text/csv');

      res.send(buffer);
      // Retrieves the xlsx format.
    } else if (acceptHeader.includes(AcceptType.ApplicationXlsx)) {
      const buffer = await this.generalLedgerApplication.xlsx(query);

      res.setHeader('Content-Disposition', 'attachment; filename=output.xlsx');
      res.setHeader(
        'Content-Type',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      );
      res.send(buffer);
      // Retrieves the pdf format.
    } else if (acceptHeader.includes(AcceptType.ApplicationPdf)) {
      const pdfContent = await this.generalLedgerApplication.pdf(query);
      res.set({
        'Content-Type': 'application/pdf',
        'Content-Length': pdfContent.length,
      });
      res.send(pdfContent);
      // Retrieves the json format.
    } else {
      return this.generalLedgerApplication.sheet(query);
    }
  }
}
