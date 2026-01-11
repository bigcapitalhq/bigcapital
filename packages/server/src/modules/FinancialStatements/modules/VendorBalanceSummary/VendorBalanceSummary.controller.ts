import { Controller, Get, Headers, Query, Res } from '@nestjs/common';
import { IVendorBalanceSummaryQuery } from './VendorBalanceSummary.types';
import { VendorBalanceSummaryApplication } from './VendorBalanceSummaryApplication';
import { Response } from 'express';
import { AcceptType } from '@/constants/accept-type';
import {
  ApiOperation,
  ApiProduces,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { VendorBalanceSummaryQueryDto } from './VendorBalanceSummaryQuery.dto';
import { ApiCommonHeaders } from '@/common/decorators/ApiCommonHeaders';

@Controller('/reports/vendor-balance-summary')
@ApiTags('Reports')
@ApiCommonHeaders()
export class VendorBalanceSummaryController {
  constructor(
    private readonly vendorBalanceSummaryApp: VendorBalanceSummaryApplication,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Get vendor balance summary' })
  @ApiResponse({ status: 200, description: 'Vendor balance summary' })
  @ApiProduces(
    AcceptType.ApplicationJson,
    AcceptType.ApplicationJsonTable,
    AcceptType.ApplicationPdf,
    AcceptType.ApplicationXlsx,
    AcceptType.ApplicationCsv,
  )
  async vendorBalanceSummary(
    @Query() filter: VendorBalanceSummaryQueryDto,
    @Res({ passthrough: true }) res: Response,
    @Headers('accept') acceptHeader: string,
  ) {
    const accept = acceptHeader || '';
    // Retrieves the csv format.
    if (accept.includes(AcceptType.ApplicationCsv)) {
      const buffer = await this.vendorBalanceSummaryApp.csv(filter);

      res.setHeader('Content-Disposition', 'attachment; filename=output.csv');
      res.setHeader('Content-Type', 'text/csv');

      res.send(buffer);
    } else if (accept.includes(AcceptType.ApplicationXlsx)) {
      const buffer = await this.vendorBalanceSummaryApp.xlsx(filter);

      res.setHeader('Content-Disposition', 'attachment; filename=output.xlsx');
      res.setHeader('Content-Type', 'application/vnd.openxmlformats');

      res.send(buffer);

      // Retrieves the json table format.
    } else if (accept.includes(AcceptType.ApplicationJsonTable)) {
      return this.vendorBalanceSummaryApp.table(filter);
      // Retrieves the pdf format.
    } else if (accept.includes(AcceptType.ApplicationPdf)) {
      const pdfContent = await this.vendorBalanceSummaryApp.pdf(filter);

      res.set({
        'Content-Type': 'application/pdf',
        'Content-Length': pdfContent.length,
      });
      res.send(pdfContent);
      // Retrieves the json format.
    } else {
      return this.vendorBalanceSummaryApp.sheet(filter);
    }
  }
}
