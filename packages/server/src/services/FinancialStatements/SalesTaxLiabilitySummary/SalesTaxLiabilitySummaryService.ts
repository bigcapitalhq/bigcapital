import { Inject, Service } from 'typedi';
import { SalesTaxLiabilitySummaryRepository } from './SalesTaxLiabilitySummaryRepository';
import { SalesTaxLiabilitySummaryQuery } from '@/interfaces/SalesTaxLiabilitySummary';
import { SalesTaxLiabilitySummary } from './SalesTaxLiabilitySummary';
import { SalesTaxLiabilitySummaryMeta } from './SalesTaxLiabilitySummaryMeta';

@Service()
export class SalesTaxLiabilitySummaryService {
  @Inject()
  private repostiory: SalesTaxLiabilitySummaryRepository;

  @Inject()
  private salesTaxLiabilityMeta: SalesTaxLiabilitySummaryMeta;

  /**
   * Retrieve sales tax liability summary.
   * @param {number} tenantId
   * @param {SalesTaxLiabilitySummaryQuery} query
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
    const meta = await this.salesTaxLiabilityMeta.meta(tenantId, query);

    return {
      data: taxLiabilitySummary.reportData(),
      query,
      meta,
    };
  }
}
