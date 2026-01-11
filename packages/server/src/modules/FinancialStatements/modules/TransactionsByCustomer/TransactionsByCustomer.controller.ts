import { Controller, Get, Headers, Query, Res } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ITransactionsByCustomersFilter } from './TransactionsByCustomer.types';
import { TransactionsByCustomerApplication } from './TransactionsByCustomersApplication';
import { AcceptType } from '@/constants/accept-type';
import { Response } from 'express';
import { TransactionsByCustomerQueryDto } from './TransactionsByCustomerQuery.dto';
import { ApiCommonHeaders } from '@/common/decorators/ApiCommonHeaders';

@Controller('/reports/transactions-by-customers')
@ApiTags('Reports')
@ApiCommonHeaders()
export class TransactionsByCustomerController {
  constructor(
    private readonly transactionsByCustomersApp: TransactionsByCustomerApplication,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Get transactions by customer' })
  @ApiResponse({ status: 200, description: 'Transactions by customer' })
  async transactionsByCustomer(
    @Query() filter: TransactionsByCustomerQueryDto,
    @Res({ passthrough: true }) res: Response,
    @Headers('accept') acceptHeader: string,
  ) {
    const accept = acceptHeader || '';
    // Retrieves the json table format.
    if (accept.includes(AcceptType.ApplicationJsonTable)) {
      return this.transactionsByCustomersApp.table(filter);

      // Retrieve the csv format.
    } else if (accept.includes(AcceptType.ApplicationCsv)) {
      const csv = await this.transactionsByCustomersApp.csv(filter);

      res.setHeader('Content-Disposition', 'attachment; filename=output.csv');
      res.setHeader('Content-Type', 'text/csv');

      res.send(csv);

      // Retrieve the xlsx format.
    } else if (accept.includes(AcceptType.ApplicationXlsx)) {
      const buffer = await this.transactionsByCustomersApp.xlsx(filter);
      res.setHeader('Content-Disposition', 'attachment; filename=output.xlsx');
      res.setHeader(
        'Content-Type',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      );
      res.send(buffer);

      // Retrieve the json format.
    } else if (accept.includes(AcceptType.ApplicationPdf)) {
      const pdfContent = await this.transactionsByCustomersApp.pdf(filter);
      res.set({
        'Content-Type': 'application/pdf',
        'Content-Length': pdfContent.length,
      });
      res.send(pdfContent);
    } else {
      return this.transactionsByCustomersApp.sheet(filter);
    }
  }
}
