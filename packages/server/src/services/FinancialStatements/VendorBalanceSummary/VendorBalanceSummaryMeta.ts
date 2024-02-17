import moment from 'moment';
import { Inject, Service } from 'typedi';
import { FinancialSheetMeta } from '../FinancialSheetMeta';
import {
  IVendorBalanceSummaryMeta,
  IVendorBalanceSummaryQuery,
} from '@/interfaces';

@Service()
export class VendorBalanceSummaryMeta {
  @Inject()
  private financialSheetMeta: FinancialSheetMeta;

  /**
   * Retrieves the vendor balance summary meta.
   * @param {number} tenantId -
   * @returns {IBalanceSheetMeta}
   */
  public async meta(
    tenantId: number,
    query: IVendorBalanceSummaryQuery
  ): Promise<IVendorBalanceSummaryMeta> {
    const commonMeta = await this.financialSheetMeta.meta(tenantId);
    const formattedAsDate = moment(query.asDate).format('YYYY/MM/DD');

    return {
      ...commonMeta,
      sheetName: 'Vendor Balance Summary',
      formattedAsDate,
    };
  }
}
