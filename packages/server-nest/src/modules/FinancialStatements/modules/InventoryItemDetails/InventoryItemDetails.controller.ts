import { Controller, Headers, Query, Res } from '@nestjs/common';
import { InventoryItemDetailsApplication } from './InventoryItemDetailsApplication';
import { IInventoryDetailsQuery } from './InventoryItemDetails.types';
import { AcceptType } from '@/constants/accept-type';
import { Response } from 'express';

@Controller('reports/inventory-item-details')
export class InventoryItemDetailsController {
  constructor(
    private readonly inventoryItemDetailsApp: InventoryItemDetailsApplication,
  ) {}

  async inventoryItemDetails(
    @Query() query: IInventoryDetailsQuery,
    @Res() res: Response,
    @Headers('accept') acceptHeader: string,
  ) {
    if (acceptHeader.includes(AcceptType.ApplicationCsv)) {
      const buffer = await this.inventoryItemDetailsApp.csv(query);

      res.setHeader('Content-Disposition', 'attachment; filename=output.csv');
      res.setHeader('Content-Type', 'text/csv');

      return res.send(buffer);
      // Retrieves the xlsx format.
    } else if (acceptHeader.includes(AcceptType.ApplicationXlsx)) {
      const buffer = await this.inventoryItemDetailsApp.xlsx(query);

      res.setHeader('Content-Disposition', 'attachment; filename=output.xlsx');
      res.setHeader(
        'Content-Type',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      );
      return res.send(buffer);
      // Retrieves the json table format.
    } else if (acceptHeader.includes(AcceptType.ApplicationJsonTable)) {
      const table = await this.inventoryItemDetailsApp.table(query);
      return res.status(200).send(table);
      // Retrieves the pdf format.
    } else if (acceptHeader.includes(AcceptType.ApplicationPdf)) {
      const buffer = await this.inventoryItemDetailsApp.pdf(query);

      res.set({
        'Content-Type': 'application/pdf',
        'Content-Length': buffer.length,
      });
      return res.send(buffer);
    } else {
      const sheet = await this.inventoryItemDetailsApp.sheet(query);

      return res.status(200).send(sheet);
    }
  }
}
