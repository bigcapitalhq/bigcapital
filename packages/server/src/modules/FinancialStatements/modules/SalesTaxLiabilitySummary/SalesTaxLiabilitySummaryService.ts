import { SalesTaxLiabilitySummaryRepository } from './SalesTaxLiabilitySummaryRepository';
import { SalesTaxLiabilitySummary } from './SalesTaxLiabilitySummary';
import { SalesTaxLiabilitySummaryMeta } from './SalesTaxLiabilitySummaryMeta';
import { Injectable } from '@nestjs/common';
import { SalesTaxLiabilitySummaryQuery } from './SalesTaxLiability.types';

@Injectable()
export class SalesTaxLiabilitySummaryService {
  constructor(
    private readonly repository: SalesTaxLiabilitySummaryRepository,
    private readonly salesTaxLiabilityMeta: SalesTaxLiabilitySummaryMeta,
  ) {}

  /**
   * Retrieve sales tax liability summary.
   * @param {SalesTaxLiabilitySummaryQuery} query
   * @returns
   */
  public async salesTaxLiability(query: SalesTaxLiabilitySummaryQuery) {
    await this.repository.load();

    const taxLiabilitySummary = new SalesTaxLiabilitySummary(
      query,
      this.repository,
    );
    const meta = await this.salesTaxLiabilityMeta.meta(query);

    return {
      data: taxLiabilitySummary.reportData(),
      query,
      meta,
    };
  }
}
