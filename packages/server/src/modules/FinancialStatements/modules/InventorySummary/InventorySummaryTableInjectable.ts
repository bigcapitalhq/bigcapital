import { Injectable } from '@nestjs/common';
import { I18nService } from 'nestjs-i18n';
import {
  IInventorySummaryQuery,
  IInventorySummaryTable,
} from './InventorySummary.types';
import { InventorySummaryService } from './InventorySummaryService';
import { InventorySummaryTable as InventorySummaryTableBuilder } from './InventorySummaryTable';

@Injectable()
export class InventorySummaryTableInjectable {
  constructor(
    private readonly inventorySummary: InventorySummaryService,
    private readonly i18n: I18nService,
  ) {}

  /**
   * Retrieve the inventory summary report in table format.
   * @param {IInventorySummaryQuery} query
   * @returns {Promise<IInventorySummaryTable>}
   */
  public async table(
    query: IInventorySummaryQuery,
  ): Promise<IInventorySummaryTable> {
    const {
      data,
      query: filter,
      meta,
    } = await this.inventorySummary.inventorySummary(query);

    const table = new InventorySummaryTableBuilder(data, this.i18n);

    return {
      table: {
        columns: table.tableColumns(),
        rows: table.tableData(),
      },
      query: filter,
      meta,
    };
  }
}
