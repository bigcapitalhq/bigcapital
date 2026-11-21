import { Injectable } from '@nestjs/common';
import { I18nService } from 'nestjs-i18n';
import { TableSheet } from '../../common/TableSheet';
import { ReconciliationStatusTableInjectable } from './ReconciliationStatusTableInjectable';
import { ReconciliationStatusQueryDto } from './ReconciliationStatusQuery.dto';
import { localizeReconciliationStatusCell, mapCellValues } from './_utils';

@Injectable()
export class ReconciliationStatusExportInjectable {
  constructor(
    private readonly reconciliationStatusTable: ReconciliationStatusTableInjectable,
    private readonly i18n: I18nService,
  ) {}

  /**
   * Retrieves the reconciliation status report in CSV format.
   * @param {ReconciliationStatusQueryDto} query
   * @returns {Promise<string>}
   */
  public async csv(query: ReconciliationStatusQueryDto): Promise<string> {
    const { table } = await this.reconciliationStatusTable.table(query);

    // Keep text fields literal when a spreadsheet opens the CSV.
    const csvTable = mapCellValues(table, (cell) => {
      const value = localizeReconciliationStatusCell(this.i18n, cell);
      return cell.key !== 'deposit' &&
        cell.key !== 'withdrawal' &&
        (/^\s*[=+\-@]/.test(value) || /^[\t\r\n]/.test(value))
        ? `'${value}`
        : value;
    });
    return new TableSheet(csvTable).convertToCSV();
  }

  /**
   * Retrieves the reconciliation status report in XLSX format.
   * @param {ReconciliationStatusQueryDto} query
   * @returns {Promise<Buffer>}
   */
  public async xlsx(query: ReconciliationStatusQueryDto): Promise<Buffer> {
    const { table, meta } = await this.reconciliationStatusTable.table(query);
    const sheet = new TableSheet(
      mapCellValues(table, (cell) =>
        localizeReconciliationStatusCell(this.i18n, cell),
      ),
    );

    return sheet.convertToBuffer(sheet.convertToXLSX(meta.sheetName), 'xlsx');
  }
}
