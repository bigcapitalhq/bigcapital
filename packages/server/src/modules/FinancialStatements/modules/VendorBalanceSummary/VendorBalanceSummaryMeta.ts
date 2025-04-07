import * as moment from 'moment';
import { Injectable } from '@nestjs/common';
import {
  IVendorBalanceSummaryMeta,
  IVendorBalanceSummaryQuery,
} from './VendorBalanceSummary.types';
import { FinancialSheetMeta } from '../../common/FinancialSheetMeta';

@Injectable()
export class VendorBalanceSummaryMeta {
  constructor(private readonly financialSheetMeta: FinancialSheetMeta) {}

  /**
   * Retrieves the vendor balance summary meta.
   * @param {IVendorBalanceSummaryQuery} query - Query.
   * @returns {IBalanceSheetMeta}
   */
  public async meta(
    query: IVendorBalanceSummaryQuery,
  ): Promise<IVendorBalanceSummaryMeta> {
    const commonMeta = await this.financialSheetMeta.meta();
    const formattedAsDate = moment(query.asDate).format('YYYY/MM/DD');

    return {
      ...commonMeta,
      sheetName: 'Vendor Balance Summary',
      formattedAsDate,
    };
  }
}
