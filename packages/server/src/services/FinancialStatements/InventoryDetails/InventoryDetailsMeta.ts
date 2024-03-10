import moment from 'moment';
import { Inject, Service } from 'typedi';
import { FinancialSheetMeta } from '../FinancialSheetMeta';
import { IInventoryDetailsQuery, IInventoryItemDetailMeta } from '@/interfaces';

@Service()
export class InventoryDetailsMetaInjectable {
  @Inject()
  private financialSheetMeta: FinancialSheetMeta;

  /**
   * Retrieve the inventoy details meta.
   * @param {number} tenantId -
   * @returns {IBalanceSheetMeta}
   */
  public async meta(
    tenantId: number,
    query: IInventoryDetailsQuery
  ): Promise<IInventoryItemDetailMeta> {
    const commonMeta = await this.financialSheetMeta.meta(tenantId);
    const formattedFromDate = moment(query.fromDate).format('YYYY/MM/DD');
    const formattedToDay = moment(query.toDate).format('YYYY/MM/DD');
    const formattedDateRange = `From ${formattedFromDate} | To ${formattedToDay}`;

    const sheetName = 'Inventory Item Details';

    return {
      ...commonMeta,
      sheetName,
      formattedFromDate,
      formattedToDay,
      formattedDateRange,
    };
  }
}
