import { Response } from 'express';
import {
  ApiOperation,
  ApiProduces,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Controller, Get, Headers, Query, Res } from '@nestjs/common';
import { InventoryValuationSheetApplication } from './InventoryValuationSheetApplication';
import { InventoryValuationQueryDto } from './InventoryValuationQuery.dto';
import { AcceptType } from '@/constants/accept-type';
import { ApiCommonHeaders } from '@/common/decorators/ApiCommonHeaders';

@Controller('reports/inventory-valuation')
@ApiTags('Reports')
@ApiCommonHeaders()
export class InventoryValuationController {
  constructor(
    private readonly inventoryValuationApp: InventoryValuationSheetApplication,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Retrieves the inventory valuation sheet' })
  @ApiResponse({
    status: 200,
    description: 'The inventory valuation sheet',
  })
  @ApiProduces(
    AcceptType.ApplicationJson,
    AcceptType.ApplicationJsonTable,
    AcceptType.ApplicationPdf,
    AcceptType.ApplicationXlsx,
    AcceptType.ApplicationCsv,
  )
  public async getInventoryValuationSheet(
    @Query() query: InventoryValuationQueryDto,
    @Res({ passthrough: true }) res: Response,
    @Headers('accept') acceptHeader: string,
  ) {
    const accept = acceptHeader || '';
    // Retrieves the json table format.
    if (accept.includes(AcceptType.ApplicationJsonTable)) {
      return this.inventoryValuationApp.table(query);
      // Retrieves the csv format.
    } else if (accept.includes(AcceptType.ApplicationCsv)) {
      const buffer = await this.inventoryValuationApp.csv(query);

      res.setHeader('Content-Disposition', 'attachment; filename=output.csv');
      res.setHeader('Content-Type', 'text/csv');

      res.send(buffer);
      // Retrieves the xslx buffer format.
    } else if (accept.includes(AcceptType.ApplicationXlsx)) {
      const buffer = await this.inventoryValuationApp.xlsx(query);

      res.setHeader('Content-Disposition', 'attachment; filename=output.xlsx');
      res.setHeader(
        'Content-Type',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      );
      res.send(buffer);
      // Retrieves the pdf format.
    } else if (accept.includes(AcceptType.ApplicationPdf)) {
      const pdfContent = await this.inventoryValuationApp.pdf(query);

      res.set({
        'Content-Type': 'application/pdf',
        'Content-Length': pdfContent.length,
      });
      res.status(200).send(pdfContent);
      // Retrieves the json format.
    } else {
      return this.inventoryValuationApp.sheet(query);
    }
  }
}
