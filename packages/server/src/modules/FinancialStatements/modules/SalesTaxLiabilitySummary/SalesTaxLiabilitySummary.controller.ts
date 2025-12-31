import { Response } from 'express';
import {
  ApiOperation,
  ApiProduces,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Controller, Get, Headers, Query, Res } from '@nestjs/common';
import { AcceptType } from '@/constants/accept-type';
import { SalesTaxLiabilitySummaryApplication } from './SalesTaxLiabilitySummaryApplication';
import { SalesTaxLiabilitySummaryQueryDto } from './dtos/SalesTaxLiabilityQuery.dto';
import { ApiCommonHeaders } from '@/common/decorators/ApiCommonHeaders';

@Controller('/reports/sales-tax-liability-summary')
@ApiTags('Reports')
@ApiCommonHeaders()
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
  @ApiProduces(
    AcceptType.ApplicationJson,
    AcceptType.ApplicationJsonTable,
    AcceptType.ApplicationPdf,
    AcceptType.ApplicationXlsx,
    AcceptType.ApplicationCsv,
  )
  public async getSalesTaxLiabilitySummary(
    @Query() query: SalesTaxLiabilitySummaryQueryDto,
    @Res({ passthrough: true }) res: Response,
    @Headers('accept') acceptHeader: string,
  ) {
    // Retrieves the json table format.
    if (acceptHeader?.includes(AcceptType.ApplicationJsonTable)) {
      return this.salesTaxLiabilitySummaryApp.table(query);
      // Retrieves the xlsx format.
    } else if (acceptHeader?.includes(AcceptType.ApplicationXlsx)) {
      const buffer = await this.salesTaxLiabilitySummaryApp.xlsx(query);

      res.setHeader('Content-Disposition', 'attachment; filename=output.xlsx');
      res.setHeader(
        'Content-Type',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      );
      res.send(buffer);
      // Retrieves the csv format.
    } else if (acceptHeader?.includes(AcceptType.ApplicationCsv)) {
      const buffer = await this.salesTaxLiabilitySummaryApp.csv(query);
      res.setHeader('Content-Disposition', 'attachment; filename=output.csv');
      res.setHeader('Content-Type', 'text/csv');

      res.send(buffer);
      // Retrieves the json format.
    } else if (acceptHeader?.includes(AcceptType.ApplicationPdf)) {
      const pdfContent = await this.salesTaxLiabilitySummaryApp.pdf(query);
      res.set({
        'Content-Type': 'application/pdf',
        'Content-Length': pdfContent.length,
      });
      res.status(200).send(pdfContent);
    } else {
      return this.salesTaxLiabilitySummaryApp.sheet(query);
    }
  }
}
