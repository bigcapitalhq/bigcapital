import { IBalanceSheetMeta, IInventoryValuationReportQuery } from '@/interfaces';
import moment from 'moment';
import { Inject, Service } from 'typedi';
import { FinancialSheetMeta } from '../FinancialSheetMeta';

@Service()
export class InventoryValuationMetaInjectable {
  @Inject()
  private financialSheetMeta: FinancialSheetMeta;

  /**
   * Retrieve the balance sheet meta.
   * @param {number} tenantId -
   * @returns {IBalanceSheetMeta}
   */
  public async meta(tenantId: number, query: IInventoryValuationReportQuery): Promise<IBalanceSheetMeta> {
    const commonMeta = await this.financialSheetMeta.meta(tenantId);
    const formattedAsDate = moment(query.asDate).format('YYYY/MM/DD');
    const formattedDateRange = `As ${formattedAsDate}`;

    return {
      ...commonMeta,
      sheetName: 'Inventory Valuation Sheet',
      formattedAsDate,
      formattedDateRange,
    };
  }
}
