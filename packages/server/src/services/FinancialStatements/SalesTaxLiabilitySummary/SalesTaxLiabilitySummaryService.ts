import { Inject, Service } from 'typedi';
import { SalesTaxLiabilitySummaryRepository } from './SalesTaxLiabilitySummaryRepository';
import { SalesTaxLiabilitySummaryQuery } from '@/interfaces/SalesTaxLiabilitySummary';
import { SalesTaxLiabilitySummary } from './SalesTaxLiabilitySummary';
import { SalesTaxLiabilitySummaryTable } from './SalesTaxLiabilitySummaryTable';

@Service()
export class SalesTaxLiabilitySummaryService {
  @Inject()
  private repostiory: SalesTaxLiabilitySummaryRepository;

  /**
   *
   * @param tenantId
   * @param query
   * @returns
   */
  public async salesTaxLiability(
    tenantId: number,
    query: SalesTaxLiabilitySummaryQuery
  ) {
    const payableByRateId =
      await this.repostiory.taxesPayableSumGroupedByRateId(tenantId);

    const salesByRateId = await this.repostiory.taxesSalesSumGroupedByRateId(
      tenantId
    );
    const taxRates = await this.repostiory.taxRates(tenantId);

    const taxLiabilitySummary = new SalesTaxLiabilitySummary(
      query,
      taxRates,
      payableByRateId,
      salesByRateId
    );
    return {
      data: taxLiabilitySummary.reportData(),
      query,
      meta: {},
    };
  }

  /**
   *
   * @param tenantId
   * @param query
   * @returns
   */
  public async salesTaxLiabilitySummaryTable(
    tenantId: number,
    query: SalesTaxLiabilitySummaryQuery
  ) {
    const report = await this.salesTaxLiability(tenantId, query);

    const table = new SalesTaxLiabilitySummaryTable(report.data, query);

    return {
      table: {
        rows: table.tableRows(),
        columns: table.tableColumns(),
      },
    };
  }
}
