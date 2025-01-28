import { TableSheet } from '../../common/TableSheet';
import { SalesTaxLiabilitySummaryQuery } from './SalesTaxLiability.types';
import { SalesTaxLiabilitySummaryTableInjectable } from './SalesTaxLiabilitySummaryTableInjectable';
import { Injectable } from '@nestjs/common';

@Injectable()
export class SalesTaxLiabilitySummaryExportInjectable {
  constructor(
    private readonly salesTaxLiabilityTable: SalesTaxLiabilitySummaryTableInjectable,
  ) {}

  /**
   * Retrieves the cashflow sheet in XLSX format.
   * @param {SalesTaxLiabilitySummaryQuery} query
   * @returns {Promise<Buffer>}
   */
  public async xlsx(query: SalesTaxLiabilitySummaryQuery): Promise<Buffer> {
    const table = await this.salesTaxLiabilityTable.table(query);

    const tableSheet = new TableSheet(table.table);
    const tableCsv = tableSheet.convertToXLSX();

    return tableSheet.convertToBuffer(tableCsv, 'xlsx');
  }

  /**
   * Retrieves the cashflow sheet in CSV format.
   * @param {SalesTaxLiabilitySummaryQuery} query
   * @returns {Promise<string>}
   */
  public async csv(query: SalesTaxLiabilitySummaryQuery): Promise<string> {
    const table = await this.salesTaxLiabilityTable.table(query);

    const tableSheet = new TableSheet(table.table);
    const tableCsv = tableSheet.convertToCSV();

    return tableCsv;
  }
}
