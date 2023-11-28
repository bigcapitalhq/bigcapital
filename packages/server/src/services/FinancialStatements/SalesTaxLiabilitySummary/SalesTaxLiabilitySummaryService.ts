import { Inject, Service } from 'typedi';
import { SalesTaxLiabilitySummaryRepository } from './SalesTaxLiabilitySummaryRepository';
import {
  SalesTaxLiabilitySummaryMeta,
  SalesTaxLiabilitySummaryQuery,
} from '@/interfaces/SalesTaxLiabilitySummary';
import { SalesTaxLiabilitySummary } from './SalesTaxLiabilitySummary';
import HasTenancyService from '@/services/Tenancy/TenancyService';

@Service()
export class SalesTaxLiabilitySummaryService {
  @Inject()
  private repostiory: SalesTaxLiabilitySummaryRepository;

  @Inject()
  private tenancy: HasTenancyService;

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
    return {
      data: taxLiabilitySummary.reportData(),
      query,
      meta: this.reportMetadata(tenantId),
    };
  }

  /**
   * Retrieve the report meta.
   * @param {number} tenantId -
   * @returns {IBalanceSheetMeta}
   */
  private reportMetadata(tenantId: number): SalesTaxLiabilitySummaryMeta {
    const settings = this.tenancy.settings(tenantId);

    const organizationName = settings.get({
      group: 'organization',
      key: 'name',
    });
    const baseCurrency = settings.get({
      group: 'organization',
      key: 'base_currency',
    });

    return {
      organizationName,
      baseCurrency,
    };
  }
}
