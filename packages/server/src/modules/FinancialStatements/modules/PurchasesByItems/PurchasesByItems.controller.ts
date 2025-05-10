import { Response } from 'express';
import { Controller, Get, Headers, Query, Res } from '@nestjs/common';
import { PurchasesByItemsApplication } from './PurchasesByItemsApplication';
import { IPurchasesByItemsReportQuery } from './types/PurchasesByItems.types';
import { AcceptType } from '@/constants/accept-type';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@Controller('/reports/purchases-by-items')
@ApiTags('reports')
export class PurchasesByItemReportController {
  constructor(
    private readonly purchasesByItemsApp: PurchasesByItemsApplication,
  ) {}

  @Get()
  @ApiResponse({ status: 200, description: 'Purchases by items report' })
  @ApiOperation({ summary: 'Get purchases by items report' })
  async purchasesByItems(
    @Query() filter: IPurchasesByItemsReportQuery,
    @Res() res: Response,
    @Headers('accept') acceptHeader: string,
  ) {
    // JSON table response format.
    if (acceptHeader.includes(AcceptType.ApplicationJsonTable)) {
      const table = await this.purchasesByItemsApp.table(filter);

      res.status(200).send(table);
      // CSV response format.
    } else if (acceptHeader.includes(AcceptType.ApplicationCsv)) {
      const buffer = await this.purchasesByItemsApp.csv(filter);

      res.setHeader('Content-Disposition', 'attachment; filename=output.csv');
      res.setHeader('Content-Type', 'text/csv');

      res.send(buffer);
      // Xlsx response format.
    } else if (acceptHeader.includes(AcceptType.ApplicationXlsx)) {
      const buffer = await this.purchasesByItemsApp.xlsx(filter);

      res.setHeader('Content-Disposition', 'attachment; filename=output.xlsx');
      res.setHeader(
        'Content-Type',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      );
      res.send(buffer);
      // PDF response format.
    } else if (acceptHeader.includes(AcceptType.ApplicationPdf)) {
      const pdfContent = await this.purchasesByItemsApp.pdf(filter);

      res.set({
        'Content-Type': 'application/pdf',
        'Content-Length': pdfContent.length,
      });
      res.send(pdfContent);
      // Json response format.
    } else {
      const sheet = await this.purchasesByItemsApp.sheet(filter);

      res.status(200).send(sheet);
    }
  }
}
