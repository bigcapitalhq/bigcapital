import { Controller, Get, Headers, Query, Res } from '@nestjs/common';
import { ITransactionsByVendorsFilter } from './TransactionsByVendor.types';
import { AcceptType } from '@/constants/accept-type';
import { Response } from 'express';
import { TransactionsByVendorApplication } from './TransactionsByVendorApplication';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@Controller('/reports/transactions-by-vendors')
@ApiTags('reports')
export class TransactionsByVendorController {
  constructor(
    private readonly transactionsByVendorsApp: TransactionsByVendorApplication,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Get transactions by vendor' })
  @ApiResponse({ status: 200, description: 'Transactions by vendor' })
  async transactionsByVendor(
    @Query() filter: ITransactionsByVendorsFilter,
    @Res() res: Response,
    @Headers('accept') acceptHeader: string,
  ) {
    // Retrieves the xlsx format.
    if (acceptHeader.includes(AcceptType.ApplicationXlsx)) {
      const buffer = await this.transactionsByVendorsApp.xlsx(filter);

      res.setHeader('Content-Type', 'application/vnd.openxmlformats');
      res.setHeader('Content-Disposition', 'attachment; filename=report.xlsx');

      return res.send(buffer);
      // Retrieves the csv format.
    } else if (acceptHeader.includes(AcceptType.ApplicationCsv)) {
      const buffer = await this.transactionsByVendorsApp.csv(filter);

      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename=report.csv');

      return res.send(buffer);
      // Retrieves the json table format.
    } else if (acceptHeader.includes(AcceptType.ApplicationJsonTable)) {
      const table = await this.transactionsByVendorsApp.table(filter);

      return res.status(200).send(table);
      // Retrieves the pdf format.
    } else if (acceptHeader.includes(AcceptType.ApplicationPdf)) {
      const pdfContent = await this.transactionsByVendorsApp.pdf(filter);
      res.set({
        'Content-Type': 'application/pdf',
        'Content-Length': pdfContent.length,
      });
      return res.send(pdfContent);
      // Retrieves the json format.
    } else {
      const sheet = await this.transactionsByVendorsApp.sheet(filter);
      return res.status(200).send(sheet);
    }
  }
}
