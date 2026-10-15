import { Injectable } from '@nestjs/common';
import { TableSheet } from '../../common/TableSheet';
import { BudgetVsActualTableInjectable } from './BudgetVsActualTableInjectable';
import { IBudgetVsActualQuery } from './BudgetVsActual.types';

@Injectable()
export class BudgetVsActualExportInjectable {
  constructor(
    private readonly budgetVsActualTable: BudgetVsActualTableInjectable,
  ) {}

  /**
   * Retrieves the budget vs actual report in XLSX format.
   * @param {IBudgetVsActualQuery} query - The report query.
   * @returns {Promise<Buffer>}
   */
  public async xlsx(query: IBudgetVsActualQuery): Promise<Buffer> {
    const table = await this.budgetVsActualTable.table(query);

    const tableSheet = new TableSheet(table.table);
    const tableCsv = tableSheet.convertToXLSX();

    return tableSheet.convertToBuffer(tableCsv, 'xlsx');
  }

  /**
   * Retrieves the budget vs actual report in CSV format.
   * @param {IBudgetVsActualQuery} query - The report query.
   * @returns {Promise<string>}
   */
  public async csv(query: IBudgetVsActualQuery): Promise<string> {
    const table = await this.budgetVsActualTable.table(query);

    const tableSheet = new TableSheet(table.table);
    const tableCsv = tableSheet.convertToCSV();

    return tableCsv;
  }
}
