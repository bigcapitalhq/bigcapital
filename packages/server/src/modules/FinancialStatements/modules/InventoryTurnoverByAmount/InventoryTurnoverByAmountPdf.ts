import { Injectable } from '@nestjs/common';
import { TableSheetPdf } from '../../common/TableSheetPdf';
import { InventoryTurnoverByAmountTableInjectable } from './InventoryTurnoverByAmountTableInjectable';
import { IInventoryTurnoverByAmountQuery } from './InventoryTurnoverByAmount.types';
import { HtmlTableCustomCss } from './_constants';

@Injectable()
export class InventoryTurnoverByAmountPdf {
  constructor(
    private readonly inventoryTurnoverByAmountTable: InventoryTurnoverByAmountTableInjectable,
    private readonly tableSheetPdf: TableSheetPdf,
  ) {}

  /**
   * Convert the inventory turnover report table to PDF.
   * @param {IInventoryTurnoverByAmountQuery} query
   * @returns {Promise<Buffer>}
   */
  public async pdf(query: IInventoryTurnoverByAmountQuery): Promise<Buffer> {
    const table = await this.inventoryTurnoverByAmountTable.table(query);

    return this.tableSheetPdf.convertToPdf(
      table.table,
      table.meta.organizationName,
      table.meta.sheetName,
      table.meta.formattedDateRange,
      HtmlTableCustomCss,
    );
  }
}
