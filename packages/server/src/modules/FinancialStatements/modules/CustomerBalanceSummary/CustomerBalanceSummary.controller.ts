import { Response } from 'express';
import {
  ApiOperation,
  ApiProduces,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Controller, Get, Headers, Query, Res } from '@nestjs/common';
import { CustomerBalanceSummaryApplication } from './CustomerBalanceSummaryApplication';
import { CustomerBalanceSummaryQueryDto } from './CustomerBalanceSummaryQuery.dto';
import { AcceptType } from '@/constants/accept-type';
import { ApiCommonHeaders } from '@/common/decorators/ApiCommonHeaders';

@Controller('/reports/customer-balance-summary')
@ApiTags('Reports')
@ApiCommonHeaders()
export class CustomerBalanceSummaryController {
  constructor(
    private readonly customerBalanceSummaryApp: CustomerBalanceSummaryApplication,
  ) {}

  @Get()
  @ApiResponse({ status: 200, description: 'Customer balance summary report' })
  @ApiOperation({ summary: 'Get customer balance summary report' })
  @ApiProduces(
    AcceptType.ApplicationJson,
    AcceptType.ApplicationJsonTable,
    AcceptType.ApplicationPdf,
    AcceptType.ApplicationXlsx,
    AcceptType.ApplicationCsv,
  )
  async customerBalanceSummary(
    @Query() filter: CustomerBalanceSummaryQueryDto,
    @Res({ passthrough: true }) res: Response,
    @Headers('accept') acceptHeader: string,
  ) {
    const accept = acceptHeader || '';
    // Retrieves the xlsx format.
    if (accept.includes(AcceptType.ApplicationXlsx)) {
      const buffer = await this.customerBalanceSummaryApp.xlsx(filter);
      res.setHeader('Content-Disposition', 'attachment; filename=output.xlsx');
      res.setHeader(
        'Content-Type',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      );
      res.send(buffer);
      // Retrieves the csv format.
    } else if (accept.includes(AcceptType.ApplicationCsv)) {
      const buffer = await this.customerBalanceSummaryApp.csv(filter);
      res.setHeader('Content-Disposition', 'attachment; filename=output.csv');
      res.setHeader('Content-Type', 'text/csv');

      res.send(buffer);
      // Retrieves the json table format.
    } else if (accept.includes(AcceptType.ApplicationJsonTable)) {
      return this.customerBalanceSummaryApp.table(filter);

      // Retrieves the pdf format.
    } else if (accept.includes(AcceptType.ApplicationPdf)) {
      const buffer = await this.customerBalanceSummaryApp.pdf(filter);

      res.set({
        'Content-Type': 'application/pdf',
        'Content-Length': buffer.length,
      });
      res.send(buffer);
      // Retrieves the json format.
    } else {
      return this.customerBalanceSummaryApp.sheet(filter);
    }
  }
}
