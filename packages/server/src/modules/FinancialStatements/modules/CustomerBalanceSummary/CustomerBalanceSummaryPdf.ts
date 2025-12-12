import { TableSheetPdf } from '../../common/TableSheetPdf';
import { ICustomerBalanceSummaryQuery } from './CustomerBalanceSummary.types';
import { CustomerBalanceSummaryTableInjectable } from './CustomerBalanceSummaryTableInjectable';
import { HtmlTableCustomCss } from './constants';
import { Injectable } from '@nestjs/common';

@Injectable()
export class CustomerBalanceSummaryPdf {
  constructor(
    private readonly customerBalanceSummaryTable: CustomerBalanceSummaryTableInjectable,
    private readonly tableSheetPdf: TableSheetPdf,
  ) {}

  /**
   * Converts the given customer balance summary sheet table to pdf.
   * @param {ICustomerBalanceSummaryQuery} query - Balance sheet query.
   * @returns {Promise<Buffer>}
   */
  public async pdf(query: ICustomerBalanceSummaryQuery): Promise<Buffer> {
    const table = await this.customerBalanceSummaryTable.table(query);

    return this.tableSheetPdf.convertToPdf(
      table.table,
      table.meta.organizationName,
      table.meta.sheetName,
      table.meta.formattedDateRange,
      HtmlTableCustomCss,
    );
  }
}
