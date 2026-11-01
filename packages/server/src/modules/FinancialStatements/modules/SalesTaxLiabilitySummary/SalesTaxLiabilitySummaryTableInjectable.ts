import {
  ISalesTaxLiabilitySummaryTable,
  SalesTaxLiabilitySummaryQuery,
} from './SalesTaxLiability.types';
import { SalesTaxLiabilitySummaryTable } from './SalesTaxLiabilitySummaryTable';
import { SalesTaxLiabilitySummaryService } from './SalesTaxLiabilitySummaryService';
import { Injectable } from '@nestjs/common';
import { I18nService } from 'nestjs-i18n';

@Injectable()
export class SalesTaxLiabilitySummaryTableInjectable {
  constructor(
    private readonly salesTaxLiability: SalesTaxLiabilitySummaryService,
    private readonly i18n: I18nService,
  ) {}

  /**
   * Retrieve sales tax liability summary table.
   * @param {SalesTaxLiabilitySummaryQuery} query
   * @returns {Promise<ISalesTaxLiabilitySummaryTable>}
   */
  public async table(
    query: SalesTaxLiabilitySummaryQuery,
  ): Promise<ISalesTaxLiabilitySummaryTable> {
    const report = await this.salesTaxLiability.salesTaxLiability(query);
    // Creates the sales tax liability summary table.
    const table = new SalesTaxLiabilitySummaryTable(
      report.data,
      query,
      this.i18n,
    );

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
