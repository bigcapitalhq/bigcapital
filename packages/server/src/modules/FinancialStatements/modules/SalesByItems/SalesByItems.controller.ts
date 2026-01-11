import {
  Body,
  Controller,
  Get,
  Headers,
  Query,
  Req,
  Res,
} from '@nestjs/common';
import { AcceptType } from '@/constants/accept-type';
import { SalesByItemsApplication } from './SalesByItemsApplication';
import { Response } from 'express';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { SalesByItemsQueryDto } from './SalesByItemsQuery.dto';
import { ApiCommonHeaders } from '@/common/decorators/ApiCommonHeaders';

@Controller('/reports/sales-by-items')
@ApiTags('Reports')
@ApiCommonHeaders()
export class SalesByItemsController {
  constructor(private readonly salesByItemsApp: SalesByItemsApplication) {}

  @Get()
  @ApiResponse({ status: 200, description: 'Sales by items report' })
  @ApiOperation({
    summary: 'Sales by items report',
    description: 'Retrieves the sales by items report.',
  })
  public async salesByitems(
    @Query() filter: SalesByItemsQueryDto,
    @Res({ passthrough: true }) res: Response,
    @Headers('accept') acceptHeader: string,
  ) {
    const accept = acceptHeader || '';
    // Retrieves the csv format.
    if (accept.includes(AcceptType.ApplicationCsv)) {
      const buffer = await this.salesByItemsApp.csv(filter);

      res.setHeader('Content-Disposition', 'attachment; filename=output.csv');
      res.setHeader('Content-Type', 'text/csv');

      res.send(buffer);
      // Retrieves the json table format.
    } else if (accept.includes(AcceptType.ApplicationJsonTable)) {
      return this.salesByItemsApp.table(filter);
      // Retrieves the xlsx format.
    } else if (accept.includes(AcceptType.ApplicationXlsx)) {
      const buffer = this.salesByItemsApp.xlsx(filter);

      res.setHeader('Content-Disposition', 'attachment; filename=output.xlsx');
      res.setHeader(
        'Content-Type',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      );
      res.send(buffer);
      // Retrieves the json format.
    } else if (accept.includes(AcceptType.ApplicationPdf)) {
      const pdfContent = await this.salesByItemsApp.pdf(filter);

      res.set({
        'Content-Type': 'application/pdf',
        'Content-Length': pdfContent.length,
      });
      res.send(pdfContent);
    } else {
      return this.salesByItemsApp.sheet(filter);
    }
  }
}
