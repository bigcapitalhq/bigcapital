import { Inject, Service } from 'typedi';
import { SalesTaxLiabilitySummaryQuery } from '@/interfaces/SalesTaxLiabilitySummary';
import { SalesTaxLiabilitySummaryTableInjectable } from './SalesTaxLiabilitySummaryTableInjectable';
import { SalesTaxLiabilitySummaryExportInjectable } from './SalesTaxLiabilitySummaryExportInjectable';
import { SalesTaxLiabilitySummaryService } from './SalesTaxLiabilitySummaryService';

@Service()
export class SalesTaxLiabilitySummaryApplication {
  @Inject()
  private salesTaxLiabilitySheet: SalesTaxLiabilitySummaryService;

  @Inject()
  private salesTaxLiabilityExport: SalesTaxLiabilitySummaryExportInjectable;

  @Inject()
  private salesTaxLiabilityTable: SalesTaxLiabilitySummaryTableInjectable;

  /**
   * Retrieves the sales tax liability summary in json format.
   * @param {number} tenantId
   * @param {SalesTaxLiabilitySummaryQuery} query
   * @returns {Promise<Buffer>}
   */
  public sheet(tenantId: number, query: SalesTaxLiabilitySummaryQuery) {
    return this.salesTaxLiabilitySheet.salesTaxLiability(tenantId, query);
  }

  /**
   * Retrieves the sales tax liability summary in table format.
   * @param {number} tenantId
   * @param {SalesTaxLiabilitySummaryQuery} query
   * @return {Promise<Buffer>}
   */
  public table(tenantId: number, query: SalesTaxLiabilitySummaryQuery) {
    return this.salesTaxLiabilityTable.table(tenantId, query);
  }

  /**
   * Retrieves the sales tax liability summary in XLSX format.
   * @param {number} tenantId
   * @param {SalesTaxLiabilitySummaryQuery} query
   * @returns {Promise<Buffer>}
   */
  public xlsx(
    tenantId: number,
    query: SalesTaxLiabilitySummaryQuery
  ): Promise<Buffer> {
    return this.salesTaxLiabilityExport.xlsx(tenantId, query);
  }

  /**
   * Retrieves the sales tax liability summary in CSV format.
   * @param {number} tenantId
   * @param {SalesTaxLiabilitySummaryQuery} query
   * @returns {Promise<string>}
   */
  public csv(
    tenantId: number,
    query: SalesTaxLiabilitySummaryQuery
  ): Promise<string> {
    return this.salesTaxLiabilityExport.csv(tenantId, query);
  }
}
