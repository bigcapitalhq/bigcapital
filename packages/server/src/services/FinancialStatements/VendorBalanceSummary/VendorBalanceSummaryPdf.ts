import { Inject, Service } from 'typedi';
import { IVendorBalanceSummaryQuery } from '@/interfaces';
import { TableSheetPdf } from '../TableSheetPdf';
import { VendorBalanceSummaryTableInjectable } from './VendorBalanceSummaryTableInjectable';
import { HtmlTableCustomCss } from './constants';

@Service()
export class VendorBalanceSummaryPdf {
  @Inject()
  private vendorBalanceSummaryTable: VendorBalanceSummaryTableInjectable;

  @Inject()
  private tableSheetPdf: TableSheetPdf;

  /**
   * Retrieves the sales by items sheet in pdf format.
   * @param {number} tenantId
   * @param {number} query
   * @returns {Promise<IBalanceSheetTable>}
   */
  public async pdf(
    tenantId: number,
    query: IVendorBalanceSummaryQuery
  ): Promise<Buffer> {
    const table = await this.vendorBalanceSummaryTable.table(tenantId, query);

    return this.tableSheetPdf.convertToPdf(
      tenantId,
      table.table,
      table.meta.sheetName,
      table.meta.formattedAsDate,
      HtmlTableCustomCss
    );
  }
}
