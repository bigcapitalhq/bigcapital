import { Injectable } from '@nestjs/common';
import { TableSheet } from '../../common/TableSheet';
import { ReconciliationStatusTableInjectable } from './ReconciliationStatusTableInjectable';
import { ReconciliationStatusQueryDto } from './ReconciliationStatusQuery.dto';
import { mapCellValues } from './_utils';

@Injectable()
export class ReconciliationStatusExportInjectable {
  constructor(
    private readonly reconciliationStatusTable: ReconciliationStatusTableInjectable,
  ) {}

  /**
   * Retrieves the reconciliation status report in CSV format.
   * @param {ReconciliationStatusQueryDto} query
   * @returns {Promise<string>}
   */
  public async csv(query: ReconciliationStatusQueryDto): Promise<string> {
    const { table } = await this.reconciliationStatusTable.table(query);

    // Keep text fields literal when a spreadsheet opens the CSV.
    const csvTable = mapCellValues(table, ({ key, value }) =>
      key !== 'deposit' &&
      key !== 'withdrawal' &&
      (/^\s*[=+\-@]/.test(value) || /^[\t\r\n]/.test(value))
        ? `'${value}`
        : value,
    );
    return new TableSheet(csvTable).convertToCSV();
  }

  /**
   * Retrieves the reconciliation status report in XLSX format.
   * @param {ReconciliationStatusQueryDto} query
   * @returns {Promise<Buffer>}
   */
  public async xlsx(query: ReconciliationStatusQueryDto): Promise<Buffer> {
    const { table } = await this.reconciliationStatusTable.table(query);
    const sheet = new TableSheet(table);

    return sheet.convertToBuffer(sheet.convertToXLSX(), 'xlsx');
  }
}
