import { SalesTaxLiabilitySummaryRepository } from './SalesTaxLiabilitySummaryRepository';
import { SalesTaxLiabilitySummary } from './SalesTaxLiabilitySummary';
import { SalesTaxLiabilitySummaryMeta } from './SalesTaxLiabilitySummaryMeta';
import { Injectable } from '@nestjs/common';
import { SalesTaxLiabilitySummaryQuery } from './SalesTaxLiability.types';
import { TenancyContext } from '@/modules/Tenancy/TenancyContext.service';

@Injectable()
export class SalesTaxLiabilitySummaryService {
  constructor(
    private readonly repository: SalesTaxLiabilitySummaryRepository,
    private readonly salesTaxLiabilityMeta: SalesTaxLiabilitySummaryMeta,
    private readonly tenancyContext: TenancyContext,
  ) {}

  /**
   * Retrieve sales tax liability summary.
   * @param {SalesTaxLiabilitySummaryQuery} query
   * @returns
   */
  public async salesTaxLiability(query: SalesTaxLiabilitySummaryQuery) {
    await this.repository.load();

    // Retrieve the meta first to get date format.
    const meta = await this.salesTaxLiabilityMeta.meta(query);

    // Get tenant metadata for baseCurrency
    const tenantMetadata = await this.tenancyContext.getTenantMetadata();

    const taxLiabilitySummary = new SalesTaxLiabilitySummary(
      query,
      this.repository,
      {
        baseCurrency: tenantMetadata.baseCurrency,
        dateFormat: meta.dateFormat,
      },
    );

    return {
      data: taxLiabilitySummary.reportData(),
      query,
      meta,
    };
  }
}
