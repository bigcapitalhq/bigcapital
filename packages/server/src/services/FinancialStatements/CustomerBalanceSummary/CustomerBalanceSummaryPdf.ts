import { Inject, Service } from 'typedi';
import { IAPAgingSummaryQuery, ICustomerBalanceSummaryQuery } from '@/interfaces';
import { TableSheetPdf } from '../TableSheetPdf';
import { CustomerBalanceSummaryTableInjectable } from './CustomerBalanceSummaryTableInjectable';

@Service()
export class CustomerBalanceSummaryPdf {
  @Inject()
  private customerBalanceSummaryTable: CustomerBalanceSummaryTableInjectable;

  @Inject()
  private tableSheetPdf: TableSheetPdf;

  /**
   * Converts the given A/P aging summary sheet table to pdf.
   * @param {number} tenantId - Tenant ID.
   * @param {IAPAgingSummaryQuery} query - Balance sheet query.
   * @returns {Promise<Buffer>}
   */
  public async pdf(
    tenantId: number,
    query: ICustomerBalanceSummaryQuery
  ): Promise<Buffer> {
    const table = await this.customerBalanceSummaryTable.table(tenantId, query);
    const sheetName = 'Customer Balance Summary';

    return this.tableSheetPdf.convertToPdf(
      tenantId,
      table.table,
      sheetName,
      table.meta.baseCurrency
    );
  }
}
