import { Inject, Service } from 'typedi';
import {
  ISalesTaxLiabilitySummaryTable,
  SalesTaxLiabilitySummaryQuery,
} from '@/interfaces/SalesTaxLiabilitySummary';
import { SalesTaxLiabilitySummaryTable } from './SalesTaxLiabilitySummaryTable';
import { SalesTaxLiabilitySummaryService } from './SalesTaxLiabilitySummaryService';

@Service()
export class SalesTaxLiabilitySummaryTableInjectable {
  @Inject()
  private salesTaxLiability: SalesTaxLiabilitySummaryService;

  /**
   * Retrieve sales tax liability summary table.
   * @param {number} tenantId
   * @param {SalesTaxLiabilitySummaryQuery} query
   * @returns {Promise<ISalesTaxLiabilitySummaryTable>}
   */
  public async table(
    tenantId: number,
    query: SalesTaxLiabilitySummaryQuery
  ): Promise<ISalesTaxLiabilitySummaryTable> {
    const report = await this.salesTaxLiability.salesTaxLiability(
      tenantId,
      query
    );
    // Creates the sales tax liability summary table.
    const table = new SalesTaxLiabilitySummaryTable(report.data, query);

    return {
      table: {
        rows: table.tableRows(),
        columns: table.tableColumns(),
      },
      query: report.query,
      meta: report.meta,
    };
  }
}
