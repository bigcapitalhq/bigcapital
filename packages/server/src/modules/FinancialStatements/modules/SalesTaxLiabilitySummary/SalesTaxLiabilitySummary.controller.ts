import { Controller, Get, Headers, Query, Res } from '@nestjs/common';
import { SalesTaxLiabilitySummaryQuery } from './SalesTaxLiability.types';
import { AcceptType } from '@/constants/accept-type';
import { SalesTaxLiabilitySummaryApplication } from './SalesTaxLiabilitySummaryApplication';
import { Response } from 'express';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@Controller('/reports/sales-tax-liability-summary')
@ApiTags('reports')
export class SalesTaxLiabilitySummaryController {
  constructor(
    private readonly salesTaxLiabilitySummaryApp: SalesTaxLiabilitySummaryApplication,
  ) {}

  @Get()
  @ApiResponse({
    status: 200,
    description: 'Sales tax liability summary report',
  })
  @ApiOperation({ summary: 'Get sales tax liability summary report' })
  public async getSalesTaxLiabilitySummary(
    @Query() query: SalesTaxLiabilitySummaryQuery,
    @Res() res: Response,
    @Headers('accept') acceptHeader: string,
  ) {
    // Retrieves the json table format.
    if (acceptHeader.includes(AcceptType.ApplicationJsonTable)) {
      const table = await this.salesTaxLiabilitySummaryApp.table(query);
      return res.status(200).send(table);
      // Retrieves the xlsx format.
    } else if (acceptHeader.includes(AcceptType.ApplicationXlsx)) {
      const buffer = await this.salesTaxLiabilitySummaryApp.xlsx(query);
      res.setHeader('Content-Disposition', 'attachment; filename=output.xlsx');
      res.setHeader(
        'Content-Type',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      );
      return res.send(buffer);
      // Retrieves the csv format.
    } else if (acceptHeader.includes(AcceptType.ApplicationCsv)) {
      const buffer = await this.salesTaxLiabilitySummaryApp.csv(query);
      res.setHeader('Content-Disposition', 'attachment; filename=output.csv');
      res.setHeader('Content-Type', 'text/csv');

      return res.send(buffer);
      // Retrieves the json format.
    } else if (acceptHeader.includes(AcceptType.ApplicationPdf)) {
      const pdfContent = await this.salesTaxLiabilitySummaryApp.pdf(query);
      res.set({
        'Content-Type': 'application/pdf',
        'Content-Length': pdfContent.length,
      });
      return res.status(200).send(pdfContent);
    } else {
      const sheet = await this.salesTaxLiabilitySummaryApp.sheet(query);
      return res.status(200).send(sheet);
    }
  }
}
