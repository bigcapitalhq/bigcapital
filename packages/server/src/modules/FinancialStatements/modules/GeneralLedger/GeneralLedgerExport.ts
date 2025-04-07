
import { Injectable } from '@nestjs/common';
import { GeneralLedgerTableInjectable } from './GeneralLedgerTableInjectable';
import { IGeneralLedgerSheetQuery } from './GeneralLedger.types';
import { TableSheet } from '../../common/TableSheet';

@Injectable()
export class GeneralLedgerExportInjectable {
  constructor(
    private readonly generalLedgerTable: GeneralLedgerTableInjectable
  ) {}

  /**
   * Retrieves the general ledger sheet in XLSX format.
   * @param {IGeneralLedgerSheetQuery} query - General ledger sheet query.
   * @returns {Promise<Buffer>}
   */
  public async xlsx(query: IGeneralLedgerSheetQuery) {
    const table = await this.generalLedgerTable.table(query);

    const tableSheet = new TableSheet(table.table);
    const tableCsv = tableSheet.convertToXLSX();

    return tableSheet.convertToBuffer(tableCsv, 'xlsx');
  }

  /**
   * Retrieves the general ledger sheet in CSV format.
   * @param {IGeneralLedgerSheetQuery} query - General ledger sheet query.
   * @returns {Promise<Buffer>}
   */
  public async csv(
    query: IGeneralLedgerSheetQuery
  ): Promise<string> {
    const table = await this.generalLedgerTable.table(query);

    const tableSheet = new TableSheet(table.table);
    const tableCsv = tableSheet.convertToCSV();

    return tableCsv;
  }
}
