import { IGeneralLedgerSheetQuery } from '@/interfaces';
import { TableSheet } from '@/lib/Xlsx/TableSheet';
import { Inject, Service } from 'typedi';
import { GeneralLedgerTableInjectable } from './GeneralLedgerTableInjectable';

@Service()
export class GeneralLedgerExportInjectable {
  @Inject()
  private generalLedgerTable: GeneralLedgerTableInjectable;

  /**
   * Retrieves the general ledger sheet in XLSX format.
   * @param {number} tenantId
   * @param {IGeneralLedgerSheetQuery} query
   * @returns {Promise<Buffer>}
   */
  public async xlsx(tenantId: number, query: IGeneralLedgerSheetQuery) {
    const table = await this.generalLedgerTable.table(tenantId, query);

    const tableSheet = new TableSheet(table.table);
    const tableCsv = tableSheet.convertToXLSX();

    return tableSheet.convertToBuffer(tableCsv, 'xlsx');
  }

  /**
   * Retrieves the general ledger sheet in CSV format.
   * @param {number} tenantId
   * @param {IGeneralLedgerSheetQuery} query
   * @returns {Promise<Buffer>}
   */
  public async csv(
    tenantId: number,
    query: IGeneralLedgerSheetQuery
  ): Promise<string> {
    const table = await this.generalLedgerTable.table(tenantId, query);

    const tableSheet = new TableSheet(table.table);
    const tableCsv = tableSheet.convertToCSV();

    return tableCsv;
  }
}
