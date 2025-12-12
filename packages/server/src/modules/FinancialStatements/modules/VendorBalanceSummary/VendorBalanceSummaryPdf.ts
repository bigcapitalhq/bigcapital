import { Injectable } from '@nestjs/common';
import { TableSheetPdf } from '../../common/TableSheetPdf';
import { IVendorBalanceSummaryQuery } from './VendorBalanceSummary.types';
import { VendorBalanceSummaryTableInjectable } from './VendorBalanceSummaryTableInjectable';
import { HtmlTableCustomCss } from './constants';

@Injectable()
export class VendorBalanceSummaryPdf {
  constructor(
    private readonly vendorBalanceSummaryTable: VendorBalanceSummaryTableInjectable,
    private readonly tableSheetPdf: TableSheetPdf,
  ) { }

  /**
   * Retrieves the sales by items sheet in pdf format.
   * @param {IVendorBalanceSummaryQuery} query - Query.
   * @returns {Promise<IBalanceSheetTable>}
   */
  public async pdf(
    query: IVendorBalanceSummaryQuery,
  ): Promise<Buffer> {
    const table = await this.vendorBalanceSummaryTable.table(query);

    return this.tableSheetPdf.convertToPdf(
      table.table,
      table.meta.organizationName,
      table.meta.sheetName,
      table.meta.formattedAsDate,
      HtmlTableCustomCss,
    );
  }
}
