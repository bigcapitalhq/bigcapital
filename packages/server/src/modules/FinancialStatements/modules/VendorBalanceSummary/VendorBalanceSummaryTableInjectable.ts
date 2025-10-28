import { Injectable } from '@nestjs/common';
import {
  IVendorBalanceSummaryQuery,
  IVendorBalanceSummaryTable,
} from './VendorBalanceSummary.types';
import { VendorBalanceSummaryTable } from './VendorBalanceSummaryTableRows';
import { VendorBalanceSummaryService } from './VendorBalanceSummaryService';
import { I18nService } from 'nestjs-i18n';

@Injectable()
export class VendorBalanceSummaryTableInjectable {
  constructor(
    private readonly vendorBalanceSummarySheet: VendorBalanceSummaryService,
    private readonly i18n: I18nService
  ) {}

  /**
   * Retrieves the vendor balance summary sheet in table format.
   * @param {IVendorBalanceSummaryQuery} query - Query.
   * @returns {Promise<IVendorBalanceSummaryTable>}
   */
  public async table(
    query: IVendorBalanceSummaryQuery,
  ): Promise<IVendorBalanceSummaryTable> {
    const { data, meta } =
      await this.vendorBalanceSummarySheet.vendorBalanceSummary(
        query,
      );
    const table = new VendorBalanceSummaryTable(data, query, this.i18n);

    return {
      table: {
        columns: table.tableColumns(),
        rows: table.tableRows(),
      },
      query,
      meta,
    };
  }
}
