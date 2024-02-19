import { Inject, Service } from 'typedi';
import { IVendorBalanceSummaryQuery } from '@/interfaces';
import { VendorBalanceSummaryTableInjectable } from './VendorBalanceSummaryTableInjectable';
import { VendorBalanceSummaryExportInjectable } from './VendorBalanceSummaryExportInjectable';
import { VendorBalanceSummaryService } from './VendorBalanceSummaryService';
import { VendorBalanceSummaryPdf } from './VendorBalanceSummaryPdf';

@Service()
export class VendorBalanceSummaryApplication {
  @Inject()
  private vendorBalanceSummaryTable: VendorBalanceSummaryTableInjectable;

  @Inject()
  private vendorBalanceSummarySheet: VendorBalanceSummaryService;

  @Inject()
  private vendorBalanceSummaryExport: VendorBalanceSummaryExportInjectable;

  @Inject()
  private vendorBalanceSummaryPdf: VendorBalanceSummaryPdf;

  /**
   * Retrieves the vendor balance summary sheet in sheet format.
   * @param {number} tenantId
   * @param {IVendorBalanceSummaryQuery} query
   */
  public sheet(tenantId: number, query: IVendorBalanceSummaryQuery) {
    return this.vendorBalanceSummarySheet.vendorBalanceSummary(tenantId, query);
  }

  /**
   * Retrieves the vendor balance summary sheet in table format.
   * @param {number} tenantId
   * @param {IVendorBalanceSummaryQuery} query
   * @returns {}
   */
  public table(tenantId: number, query: IVendorBalanceSummaryQuery) {
    return this.vendorBalanceSummaryTable.table(tenantId, query);
  }

  /**
   * Retrieves the vendor balance summary sheet in xlsx format.
   * @param {number} tenantId
   * @param {IVendorBalanceSummaryQuery} query
   * @returns {Promise<Buffer>}
   */
  public xlsx(
    tenantId: number,
    query: IVendorBalanceSummaryQuery
  ): Promise<Buffer> {
    return this.vendorBalanceSummaryExport.xlsx(tenantId, query);
  }

  /**
   * Retrieves the vendor balance summary sheet in csv format.
   * @param {number} tenantId
   * @param {IVendorBalanceSummaryQuery} query
   * @returns {Promise<Buffer>}
   */
  public csv(
    tenantId: number,
    query: IVendorBalanceSummaryQuery
  ): Promise<string> {
    return this.vendorBalanceSummaryExport.csv(tenantId, query);
  }

  /**
   * Retrieves the vendor balance summary sheet in pdf format.
   * @param {number} tenantId
   * @param {IVendorBalanceSummaryQuery} query
   * @returns {Promise<Buffer>}
   */
  public pdf(tenantId: number, query: IVendorBalanceSummaryQuery) {
    return this.vendorBalanceSummaryPdf.pdf(tenantId, query);
  }
}
