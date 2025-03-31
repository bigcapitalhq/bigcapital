import { Controller, Get, Headers, Query, Res } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ITransactionsByCustomersFilter } from './TransactionsByCustomer.types';
import { TransactionsByCustomerApplication } from './TransactionsByCustomersApplication';
import { AcceptType } from '@/constants/accept-type';
import { Response } from 'express';
import { PublicRoute } from '@/modules/Auth/guards/Jwt.local';

@Controller('/reports/transactions-by-customers')
@ApiTags('reports')
@PublicRoute()
export class TransactionsByCustomerController {
  constructor(
    private readonly transactionsByCustomersApp: TransactionsByCustomerApplication,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Get transactions by customer' })
  @ApiResponse({ status: 200, description: 'Transactions by customer' })
  async transactionsByCustomer(
    @Query() filter: ITransactionsByCustomersFilter,
    @Res() res: Response,
    @Headers('accept') acceptHeader: string,
  ) {
    // Retrieves the json table format.
    if (acceptHeader.includes(AcceptType.ApplicationJsonTable)) {
      const table = await this.transactionsByCustomersApp.table(filter);
      return res.status(200).send(table);

      // Retrieve the csv format.
    } else if (acceptHeader.includes(AcceptType.ApplicationCsv)) {
      const csv = await this.transactionsByCustomersApp.csv(filter);

      res.setHeader('Content-Disposition', 'attachment; filename=output.csv');
      res.setHeader('Content-Type', 'text/csv');

      return res.send(csv);

      // Retrieve the xlsx format.
    } else if (acceptHeader.includes(AcceptType.ApplicationXlsx)) {
      const buffer = await this.transactionsByCustomersApp.xlsx(filter);
      res.setHeader('Content-Disposition', 'attachment; filename=output.xlsx');
      res.setHeader(
        'Content-Type',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      );
      return res.send(buffer);

      // Retrieve the json format.
    } else if (acceptHeader.includes(AcceptType.ApplicationPdf)) {
      const pdfContent = await this.transactionsByCustomersApp.pdf(filter);
      res.set({
        'Content-Type': 'application/pdf',
        'Content-Length': pdfContent.length,
      });
      return res.send(pdfContent);
    } else {
      const sheet = await this.transactionsByCustomersApp.sheet(filter);
      return res.status(200).send(sheet);
    }
  }
}
