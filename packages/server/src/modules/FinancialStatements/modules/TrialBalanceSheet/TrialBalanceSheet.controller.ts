import { Controller, Get, Headers, Query, Res } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { castArray } from 'lodash';
import { Response } from 'express';
import { AcceptType } from '@/constants/accept-type';
import { TrialBalanceSheetApplication } from './TrialBalanceSheetApplication';
import { TrialBalanceSheetQueryDto } from './TrialBalanceSheetQuery.dto';
import { TrialBalanceSheetResponseExample } from './TrialBalanceSheet.swagger';

@Controller('reports/trial-balance-sheet')
@ApiTags('Reports')
export class TrialBalanceSheetController {
  constructor(
    private readonly trialBalanceSheetApp: TrialBalanceSheetApplication,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Get trial balance sheet' })
  @ApiResponse({
    status: 200,
    description: 'Trial balance sheet',
    example: TrialBalanceSheetResponseExample,
  })
  async getTrialBalanceSheet(
    @Query() query: TrialBalanceSheetQueryDto,
    @Res({ passthrough: true }) res: Response,
    @Headers('accept') acceptHeader: string,
  ) {
    const filter = {
      ...query,
      accountIds: castArray(query.accountIds),
    };
    // Retrieves in json table format.
    if (acceptHeader.includes(AcceptType.ApplicationJsonTable)) {
      return this.trialBalanceSheetApp.table(filter);
      // Retrieves in xlsx format
    } else if (acceptHeader.includes(AcceptType.ApplicationXlsx)) {
      const buffer = await this.trialBalanceSheetApp.xlsx(filter);

      res.setHeader('Content-Disposition', 'attachment; filename=output.xlsx');
      res.setHeader(
        'Content-Type',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      );
      res.send(buffer);
      // Retrieves in csv format.
    } else if (acceptHeader.includes(AcceptType.ApplicationCsv)) {
      const buffer = await this.trialBalanceSheetApp.csv(filter);

      res.setHeader('Content-Disposition', 'attachment; filename=output.csv');
      res.setHeader('Content-Type', 'text/csv');

      res.send(buffer);
      // Retrieves in pdf format.
    } else if (acceptHeader.includes(AcceptType.ApplicationPdf)) {
      const pdfContent = await this.trialBalanceSheetApp.pdf(filter);

      res.set({
        'Content-Type': 'application/pdf',
        'Content-Length': pdfContent.length,
      });
      res.send(pdfContent);
      // Retrieves in json format.
    } else {
      return this.trialBalanceSheetApp.sheet(filter);
    }
  }
}
