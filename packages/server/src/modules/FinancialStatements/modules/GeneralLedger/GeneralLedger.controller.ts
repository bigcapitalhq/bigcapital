import {
  ApiOperation,
  ApiProduces,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Response } from 'express';
import { Controller, Get, Headers, Query, Res } from '@nestjs/common';
import { GeneralLedgerApplication } from './GeneralLedgerApplication';
import { AcceptType } from '@/constants/accept-type';
import { GeneralLedgerQueryDto } from './GeneralLedgerQuery.dto';
import { GeneralLedgerResponseExample } from './GeneralLedger.swagger';
import { ApiCommonHeaders } from '@/common/decorators/ApiCommonHeaders';

@Controller('/reports/general-ledger')
@ApiTags('Reports')
@ApiCommonHeaders()
export class GeneralLedgerController {
  constructor(
    private readonly generalLedgerApplication: GeneralLedgerApplication,
  ) {}

  @Get()
  @ApiResponse({
    status: 200,
    description: 'General ledger report',
    example: GeneralLedgerResponseExample,
  })
  @ApiOperation({ summary: 'Get general ledger report' })
  @ApiProduces(
    AcceptType.ApplicationJson,
    AcceptType.ApplicationJsonTable,
    AcceptType.ApplicationPdf,
    AcceptType.ApplicationXlsx,
    AcceptType.ApplicationCsv,
  )
  public async getGeneralLedger(
    @Query() query: GeneralLedgerQueryDto,
    @Res({ passthrough: true }) res: Response,
    @Headers('accept') acceptHeader: string,
  ) {
    const accept = acceptHeader || '';
    // Retrieves the table format.
    if (accept.includes(AcceptType.ApplicationJsonTable)) {
      return this.generalLedgerApplication.table(query);
      // Retrieves the csv format.
    } else if (accept.includes(AcceptType.ApplicationCsv)) {
      const buffer = await this.generalLedgerApplication.csv(query);

      res.setHeader('Content-Disposition', 'attachment; filename=output.csv');
      res.setHeader('Content-Type', 'text/csv');

      res.send(buffer);
      // Retrieves the xlsx format.
    } else if (accept.includes(AcceptType.ApplicationXlsx)) {
      const buffer = await this.generalLedgerApplication.xlsx(query);

      res.setHeader('Content-Disposition', 'attachment; filename=output.xlsx');
      res.setHeader(
        'Content-Type',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      );
      res.send(buffer);
      // Retrieves the pdf format.
    } else if (accept.includes(AcceptType.ApplicationPdf)) {
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
