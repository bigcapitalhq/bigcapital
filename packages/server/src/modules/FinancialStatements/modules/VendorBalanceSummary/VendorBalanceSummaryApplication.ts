import { VendorBalanceSummaryTableInjectable } from './VendorBalanceSummaryTableInjectable';
import { VendorBalanceSummaryExportInjectable } from './VendorBalanceSummaryExportInjectable';
import { VendorBalanceSummaryService } from './VendorBalanceSummaryService';
import { VendorBalanceSummaryPdf } from './VendorBalanceSummaryPdf';
import { Injectable } from '@nestjs/common';
import { IVendorBalanceSummaryQuery } from './VendorBalanceSummary.types';

@Injectable()
export class VendorBalanceSummaryApplication {
  constructor(
    private readonly vendorBalanceSummaryTable: VendorBalanceSummaryTableInjectable,
    private readonly vendorBalanceSummarySheet: VendorBalanceSummaryService,
    private readonly vendorBalanceSummaryExport: VendorBalanceSummaryExportInjectable,
    private readonly vendorBalanceSummaryPdf: VendorBalanceSummaryPdf,
  ) {}

  /**
   * Retrieves the vendor balance summary sheet in sheet format.
   * @param {IVendorBalanceSummaryQuery} query
   */
  public sheet(query: IVendorBalanceSummaryQuery) {
    return this.vendorBalanceSummarySheet.vendorBalanceSummary(query);
  }

  /**
   * Retrieves the vendor balance summary sheet in table format.
   * @param {IVendorBalanceSummaryQuery} query
   * @returns {}
   */
  public table(query: IVendorBalanceSummaryQuery) {
    return this.vendorBalanceSummaryTable.table(query);
  }

  /**
   * Retrieves the vendor balance summary sheet in xlsx format.
   * @param {IVendorBalanceSummaryQuery} query
   * @returns {Promise<Buffer>}
   */
  public xlsx(query: IVendorBalanceSummaryQuery): Promise<Buffer> {
    return this.vendorBalanceSummaryExport.xlsx(query);
  }

  /**
   * Retrieves the vendor balance summary sheet in csv format.
   * @param {IVendorBalanceSummaryQuery} query
   * @returns {Promise<Buffer>}
   */
  public csv(query: IVendorBalanceSummaryQuery): Promise<string> {
    return this.vendorBalanceSummaryExport.csv(query);
  }

  /**
   * Retrieves the vendor balance summary sheet in pdf format.
   * @param {IVendorBalanceSummaryQuery} query
   * @returns {Promise<Buffer>}
   */
  public pdf(query: IVendorBalanceSummaryQuery) {
    return this.vendorBalanceSummaryPdf.pdf(query);
  }
}
