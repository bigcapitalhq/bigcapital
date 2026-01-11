import { Controller, Get, Headers, Query, Res } from '@nestjs/common';
import { ITransactionsByVendorsFilter } from './TransactionsByVendor.types';
import { AcceptType } from '@/constants/accept-type';
import { Response } from 'express';
import { TransactionsByVendorApplication } from './TransactionsByVendorApplication';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { TransactionsByVendorQueryDto } from './TransactionsByVendorQuery.dto';
import { ApiCommonHeaders } from '@/common/decorators/ApiCommonHeaders';

@Controller('/reports/transactions-by-vendors')
@ApiTags('Reports')
@ApiCommonHeaders()
export class TransactionsByVendorController {
  constructor(
    private readonly transactionsByVendorsApp: TransactionsByVendorApplication,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Get transactions by vendor' })
  @ApiResponse({ status: 200, description: 'Transactions by vendor' })
  async transactionsByVendor(
    @Query() filter: TransactionsByVendorQueryDto,
    @Res({ passthrough: true }) res: Response,
    @Headers('accept') acceptHeader: string,
  ) {
    const accept = acceptHeader || '';
    // Retrieves the xlsx format.
    if (accept.includes(AcceptType.ApplicationXlsx)) {
      const buffer = await this.transactionsByVendorsApp.xlsx(filter);

      res.setHeader('Content-Type', 'application/vnd.openxmlformats');
      res.setHeader('Content-Disposition', 'attachment; filename=report.xlsx');

      res.send(buffer);
      // Retrieves the csv format.
    } else if (accept.includes(AcceptType.ApplicationCsv)) {
      const buffer = await this.transactionsByVendorsApp.csv(filter);

      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename=report.csv');

      res.send(buffer);
      // Retrieves the json table format.
    } else if (accept.includes(AcceptType.ApplicationJsonTable)) {
      return this.transactionsByVendorsApp.table(filter);
      // Retrieves the pdf format.
    } else if (accept.includes(AcceptType.ApplicationPdf)) {
      const pdfContent = await this.transactionsByVendorsApp.pdf(filter);
      res.set({
        'Content-Type': 'application/pdf',
        'Content-Length': pdfContent.length,
      });
      res.send(pdfContent);
      // Retrieves the json format.
    } else {
      return this.transactionsByVendorsApp.sheet(filter);
    }
  }
}
