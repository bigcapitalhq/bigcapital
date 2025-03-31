import { Response } from 'express';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Controller, Get, Headers, Query, Res } from '@nestjs/common';
import { ICustomerBalanceSummaryQuery } from './CustomerBalanceSummary.types';
import { CustomerBalanceSummaryApplication } from './CustomerBalanceSummaryApplication';
import { AcceptType } from '@/constants/accept-type';
import { PublicRoute } from '@/modules/Auth/guards/Jwt.local';

@Controller('/reports/customer-balance-summary')
@ApiTags('reports')
@PublicRoute()
export class CustomerBalanceSummaryController {
  constructor(
    private readonly customerBalanceSummaryApp: CustomerBalanceSummaryApplication,
  ) {}

  @Get()
  @ApiResponse({ status: 200, description: 'Customer balance summary report' })
  @ApiOperation({ summary: 'Get customer balance summary report' })
  async customerBalanceSummary(
    @Query() filter: ICustomerBalanceSummaryQuery,
    @Res() res: Response,
    @Headers('accept') acceptHeader: string,
  ) {
    // Retrieves the xlsx format.
    if (acceptHeader.includes(AcceptType.ApplicationXlsx)) {
      const buffer = await this.customerBalanceSummaryApp.xlsx(filter);
      res.setHeader('Content-Disposition', 'attachment; filename=output.xlsx');
      res.setHeader(
        'Content-Type',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      );
      return res.send(buffer);
      // Retrieves the csv format.
    } else if (acceptHeader.includes(AcceptType.ApplicationCsv)) {
      const buffer = await this.customerBalanceSummaryApp.csv(filter);
      res.setHeader('Content-Disposition', 'attachment; filename=output.csv');
      res.setHeader('Content-Type', 'text/csv');

      return res.send(buffer);
      // Retrieves the json table format.
    } else if (acceptHeader.includes(AcceptType.ApplicationJsonTable)) {
      const table = await this.customerBalanceSummaryApp.table(filter);
      return res.status(200).send(table);
      // Retrieves the pdf format.
    } else if (acceptHeader.includes(AcceptType.ApplicationPdf)) {
      const buffer = await this.customerBalanceSummaryApp.pdf(filter);

      res.set({
        'Content-Type': 'application/pdf',
        'Content-Length': buffer.length,
      });
      return res.send(buffer);
      // Retrieves the json format.
    } else {
      const sheet = await this.customerBalanceSummaryApp.sheet(filter);
      return res.status(200).send(sheet);
    }
  }
}
