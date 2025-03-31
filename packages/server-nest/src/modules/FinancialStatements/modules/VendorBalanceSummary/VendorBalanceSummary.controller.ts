import { Controller, Get, Headers, Query, Res } from '@nestjs/common';
import { IVendorBalanceSummaryQuery } from './VendorBalanceSummary.types';
import { VendorBalanceSummaryApplication } from './VendorBalanceSummaryApplication';
import { Response } from 'express';
import { AcceptType } from '@/constants/accept-type';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { PublicRoute } from '@/modules/Auth/guards/Jwt.local';

@Controller('/reports/vendor-balance-summary')
@ApiTags('reports')
@PublicRoute()
export class VendorBalanceSummaryController {
  constructor(
    private readonly vendorBalanceSummaryApp: VendorBalanceSummaryApplication,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Get vendor balance summary' })
  @ApiResponse({ status: 200, description: 'Vendor balance summary' })
  async vendorBalanceSummary(
    @Query() filter: IVendorBalanceSummaryQuery,
    @Res() res: Response,
    @Headers('accept') acceptHeader: string,
  ) {
    // Retrieves the csv format.
    if (acceptHeader.includes(AcceptType.ApplicationCsv)) {
      const buffer = await this.vendorBalanceSummaryApp.csv(filter);

      res.setHeader('Content-Disposition', 'attachment; filename=output.csv');
      res.setHeader('Content-Type', 'text/csv');

      return res.send(buffer);
    } else if (acceptHeader.includes(AcceptType.ApplicationXlsx)) {
      const buffer = await this.vendorBalanceSummaryApp.xlsx(filter);

      res.setHeader('Content-Disposition', 'attachment; filename=output.xlsx');
      res.setHeader('Content-Type', 'application/vnd.openxmlformats');

      return res.send(buffer);

      // Retrieves the json table format.
    } else if (acceptHeader.includes(AcceptType.ApplicationJsonTable)) {
      const table = await this.vendorBalanceSummaryApp.table(filter);

      return res.status(200).send(table);
      // Retrieves the pdf format.
    } else if (acceptHeader.includes(AcceptType.ApplicationPdf)) {
      const pdfContent = await this.vendorBalanceSummaryApp.pdf(filter);

      res.set({
        'Content-Type': 'application/pdf',
        'Content-Length': pdfContent.length,
      });
      return res.send(pdfContent);
      // Retrieves the json format.
    } else {
      const sheet = await this.vendorBalanceSummaryApp.sheet(filter);
      return res.status(200).send(sheet);
    }
  }
}
