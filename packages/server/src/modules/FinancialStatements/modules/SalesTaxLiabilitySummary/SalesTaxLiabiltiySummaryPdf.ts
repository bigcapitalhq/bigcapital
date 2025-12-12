import { Injectable } from '@nestjs/common';
import { SalesTaxLiabilitySummaryTableInjectable } from './SalesTaxLiabilitySummaryTableInjectable';
import { TableSheetPdf } from '../../common/TableSheetPdf';
import { SalesTaxLiabilitySummaryQuery } from './SalesTaxLiability.types';

@Injectable()
export class SalesTaxLiabiltiySummaryPdf {
  constructor(
    private readonly salesTaxLiabiltiySummaryTable: SalesTaxLiabilitySummaryTableInjectable,
    private readonly tableSheetPdf: TableSheetPdf,
  ) { }

  /**
   * Converts the given sales tax liability summary table to pdf.
   * @param {ISalesByItemsReportQuery} query - Balance sheet query.
   * @returns {Promise<Buffer>}
   */
  public async pdf(query: SalesTaxLiabilitySummaryQuery): Promise<Buffer> {
    const table = await this.salesTaxLiabiltiySummaryTable.table(
      query,
    );
    return this.tableSheetPdf.convertToPdf(
      table.table,
      table.meta.organizationName,
      table.meta.sheetName,
      table.meta.formattedDateRange,
    );
  }
}
