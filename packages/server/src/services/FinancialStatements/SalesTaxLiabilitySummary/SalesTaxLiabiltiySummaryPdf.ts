import { Inject, Service } from 'typedi';
import { TableSheetPdf } from '../TableSheetPdf';
import { SalesTaxLiabilitySummaryTableInjectable } from './SalesTaxLiabilitySummaryTableInjectable';
import { ISalesByItemsReportQuery } from '@/interfaces';
import { SalesTaxLiabilitySummaryQuery } from '@/interfaces/SalesTaxLiabilitySummary';

@Service()
export class SalesTaxLiabiltiySummaryPdf {
  @Inject()
  private salesTaxLiabiltiySummaryTable: SalesTaxLiabilitySummaryTableInjectable;

  @Inject()
  private tableSheetPdf: TableSheetPdf;

  /**
   * Converts the given sales tax liability summary table to pdf.
   * @param {number} tenantId - Tenant ID.
   * @param {ISalesByItemsReportQuery} query - Balance sheet query.
   * @returns {Promise<Buffer>}
   */
  public async pdf(
    tenantId: number,
    query: SalesTaxLiabilitySummaryQuery
  ): Promise<Buffer> {
    const table = await this.salesTaxLiabiltiySummaryTable.table(
      tenantId,
      query
    );
    return this.tableSheetPdf.convertToPdf(
      tenantId,
      table.table,
      table.meta.sheetName,
      table.meta.formattedDateRange
    );
  }
}
