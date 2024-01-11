import { SalesTaxLiabilitySummaryQuery } from '@/interfaces/SalesTaxLiabilitySummary';
import { TableSheet } from '@/lib/Xlsx/TableSheet';
import { Inject, Service } from 'typedi';
import { SalesTaxLiabilitySummaryTableInjectable } from './SalesTaxLiabilitySummaryTableInjectable';

@Service()
export class SalesTaxLiabilitySummaryExportInjectable {
  @Inject()
  private salesTaxLiabilityTable: SalesTaxLiabilitySummaryTableInjectable;

  /**
   * Retrieves the cashflow sheet in XLSX format.
   * @param {number} tenantId
   * @param {ICashFlowStatementQuery} query
   * @returns {Promise<Buffer>}
   */
  public async xlsx(
    tenantId: number,
    query: SalesTaxLiabilitySummaryQuery
  ): Promise<Buffer> {
    const table = await this.salesTaxLiabilityTable.table(tenantId, query);

    const tableSheet = new TableSheet(table.table);
    const tableCsv = tableSheet.convertToXLSX();

    return tableSheet.convertToBuffer(tableCsv, 'xlsx');
  }

  /**
   * Retrieves the cashflow sheet in CSV format.
   * @param {number} tenantId
   * @param {ICashFlowStatementQuery} query
   * @returns {Promise<string>}
   */
  public async csv(
    tenantId: number,
    query: SalesTaxLiabilitySummaryQuery
  ): Promise<string> {
    const table = await this.salesTaxLiabilityTable.table(tenantId, query);

    const tableSheet = new TableSheet(table.table);
    const tableCsv = tableSheet.convertToCSV();

    return tableCsv;
  }
}
