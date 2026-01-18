import { Response } from 'express';
import { Controller, Get, Headers, Query, Res } from '@nestjs/common';
import { PurchasesByItemsApplication } from './PurchasesByItemsApplication';
import { AcceptType } from '@/constants/accept-type';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { PurchasesByItemsQueryDto } from './PurchasesByItemsQuery.dto';
import { ApiCommonHeaders } from '@/common/decorators/ApiCommonHeaders';

@Controller('/reports/purchases-by-items')
@ApiTags('Reports')
@ApiCommonHeaders()
export class PurchasesByItemReportController {
  constructor(
    private readonly purchasesByItemsApp: PurchasesByItemsApplication,
  ) {}

  @Get()
  @ApiResponse({ status: 200, description: 'Purchases by items report' })
  @ApiOperation({ summary: 'Get purchases by items report' })
  async purchasesByItems(
    @Query() filter: PurchasesByItemsQueryDto,
    @Res({ passthrough: true }) res: Response,
    @Headers('accept') acceptHeader: string,
  ) {
    const accept = acceptHeader || '';
    // JSON table response format.
    if (accept.includes(AcceptType.ApplicationJsonTable)) {
      return this.purchasesByItemsApp.table(filter);
      // CSV response format.
    } else if (accept.includes(AcceptType.ApplicationCsv)) {
      const buffer = await this.purchasesByItemsApp.csv(filter);

      res.setHeader('Content-Disposition', 'attachment; filename=output.csv');
      res.setHeader('Content-Type', 'text/csv');

      res.send(buffer);
      // Xlsx response format.
    } else if (accept.includes(AcceptType.ApplicationXlsx)) {
      const buffer = await this.purchasesByItemsApp.xlsx(filter);

      res.setHeader('Content-Disposition', 'attachment; filename=output.xlsx');
      res.setHeader(
        'Content-Type',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      );
      res.send(buffer);
      // PDF response format.
    } else if (accept.includes(AcceptType.ApplicationPdf)) {
      const pdfContent = await this.purchasesByItemsApp.pdf(filter);

      res.set({
        'Content-Type': 'application/pdf',
        'Content-Length': pdfContent.length,
      });
      res.send(pdfContent);
      // Json response format.
    } else {
      return this.purchasesByItemsApp.sheet(filter);
    }
  }
}
