import { Inject, Service } from 'typedi';
import { ICustomerBalanceSummaryQuery } from '@/interfaces';

import { TableSheetPdf } from '../TableSheetPdf';
import { CustomerBalanceSummaryTableInjectable } from './CustomerBalanceSummaryTableInjectable';
import { HtmlTableCustomCss } from './constants';

@Service()
export class CustomerBalanceSummaryPdf {
  @Inject()
  private customerBalanceSummaryTable: CustomerBalanceSummaryTableInjectable;

  @Inject()
  private tableSheetPdf: TableSheetPdf;

  /**
   * Converts the given customer balance summary sheet table to pdf.
   * @param {number} tenantId - Tenant ID.
   * @param {IAPAgingSummaryQuery} query - Balance sheet query.
   * @returns {Promise<Buffer>}
   */
  public async pdf(
    tenantId: number,
    query: ICustomerBalanceSummaryQuery
  ): Promise<Buffer> {
    const table = await this.customerBalanceSummaryTable.table(tenantId, query);

    return this.tableSheetPdf.convertToPdf(
      tenantId,
      table.table,
      table.meta.sheetName,
      table.meta.formattedDateRange,
      HtmlTableCustomCss
    );
  }
}
