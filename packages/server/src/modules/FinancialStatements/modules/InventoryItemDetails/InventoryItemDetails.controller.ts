import { Response } from 'express';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Controller, Get, Headers, Query, Res } from '@nestjs/common';
import { InventoryItemDetailsApplication } from './InventoryItemDetailsApplication';
import { AcceptType } from '@/constants/accept-type';
import { InventoryItemDetailsQueryDto } from './InventoryItemDetailsQuery.dto';
import { ApiCommonHeaders } from '@/common/decorators/ApiCommonHeaders';

@Controller('reports/inventory-item-details')
@ApiTags('Reports')
@ApiCommonHeaders()
export class InventoryItemDetailsController {
  constructor(
    private readonly inventoryItemDetailsApp: InventoryItemDetailsApplication,
  ) {}

  @Get('/')
  @ApiOperation({ summary: 'Get inventory item details' })
  async inventoryItemDetails(
    @Query() query: InventoryItemDetailsQueryDto,
    @Res({ passthrough: true }) res: Response,
    @Headers('accept') acceptHeader: string,
  ) {
    const accept = acceptHeader || '';
    if (accept.includes(AcceptType.ApplicationCsv)) {
      const buffer = await this.inventoryItemDetailsApp.csv(query);

      res.setHeader('Content-Disposition', 'attachment; filename=output.csv');
      res.setHeader('Content-Type', 'text/csv');

      res.send(buffer);
      // Retrieves the xlsx format.
    } else if (accept.includes(AcceptType.ApplicationXlsx)) {
      const buffer = await this.inventoryItemDetailsApp.xlsx(query);

      res.setHeader('Content-Disposition', 'attachment; filename=output.xlsx');
      res.setHeader(
        'Content-Type',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      );
      res.send(buffer);
      // Retrieves the json table format.
    } else if (accept.includes(AcceptType.ApplicationJsonTable)) {
      return this.inventoryItemDetailsApp.table(query);
      // Retrieves the pdf format.
    } else if (accept.includes(AcceptType.ApplicationPdf)) {
      const buffer = await this.inventoryItemDetailsApp.pdf(query);

      res.set({
        'Content-Type': 'application/pdf',
        'Content-Length': buffer.length,
      });
      res.send(buffer);
    } else {
      return this.inventoryItemDetailsApp.sheet(query);
    }
  }
}
