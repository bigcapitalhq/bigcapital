
import { SalesTaxLiabilitySummaryTableInjectable } from './SalesTaxLiabilitySummaryTableInjectable';
import { SalesTaxLiabilitySummaryExportInjectable } from './SalesTaxLiabilitySummaryExportInjectable';
import { SalesTaxLiabilitySummaryService } from './SalesTaxLiabilitySummaryService';
import { SalesTaxLiabiltiySummaryPdf } from './SalesTaxLiabiltiySummaryPdf';
import { Injectable } from '@nestjs/common';
import { SalesTaxLiabilitySummaryQuery } from './SalesTaxLiability.types';

@Injectable()
export class SalesTaxLiabilitySummaryApplication {
  constructor(
    private readonly salesTaxLiabilitySheet: SalesTaxLiabilitySummaryService,
    private readonly salesTaxLiabilityExport: SalesTaxLiabilitySummaryExportInjectable,
    private readonly salesTaxLiabilityTable: SalesTaxLiabilitySummaryTableInjectable,
    private readonly salesTaxLiabiltiyPdf: SalesTaxLiabiltiySummaryPdf,
  ) {}

  /**
   * Retrieves the sales tax liability summary in json format.
   * @param {SalesTaxLiabilitySummaryQuery} query - 
   * @returns {Promise<Buffer>}
   */
  public sheet(query: SalesTaxLiabilitySummaryQuery) {
    return this.salesTaxLiabilitySheet.salesTaxLiability(query);
  }

  /**
   * Retrieves the sales tax liability summary in table format.
   * @param {SalesTaxLiabilitySummaryQuery} query
   * @return {Promise<Buffer>}
   */
  public table(query: SalesTaxLiabilitySummaryQuery) {
    return this.salesTaxLiabilityTable.table(query);
  }

  /**
   * Retrieves the sales tax liability summary in XLSX format.
   * @param {SalesTaxLiabilitySummaryQuery} query
   * @returns {Promise<Buffer>}
   */
  public xlsx(query: SalesTaxLiabilitySummaryQuery): Promise<Buffer> {
    return this.salesTaxLiabilityExport.xlsx(query);
  }

  /**
   * Retrieves the sales tax liability summary in CSV format.
   * @param {SalesTaxLiabilitySummaryQuery} query
   * @returns {Promise<string>}
   */
  public csv(query: SalesTaxLiabilitySummaryQuery): Promise<string> {
    return this.salesTaxLiabilityExport.csv(query);
  }

  /**
   * Retrieves the sales tax liability summary in PDF format.
   * @param {SalesTaxLiabilitySummaryQuery} query
   * @returns {Promise<Buffer>}
   */
  public pdf(query: SalesTaxLiabilitySummaryQuery): Promise<Buffer> {
    return this.salesTaxLiabiltiyPdf.pdf(query);
  }
}
