import { Injectable } from '@nestjs/common';
import * as moment from 'moment';
import { FinancialSheetMeta } from '../../common/FinancialSheetMeta';
import { IBalanceSheetMeta, IBalanceSheetQuery } from './BalanceSheet.types';

@Injectable()
export class BalanceSheetMetaInjectable {
  constructor(private readonly financialSheetMeta: FinancialSheetMeta) {}

  /**
   * Retrieves the balance sheet meta.
   * @returns {IBalanceSheetMeta}
   */
  public async meta(query: IBalanceSheetQuery): Promise<IBalanceSheetMeta> {
    const commonMeta = await this.financialSheetMeta.meta();
    const formattedAsDate = moment(query.toDate).format('YYYY/MM/DD');
    const formattedDateRange = `As ${formattedAsDate}`;
    const sheetName = 'Balance Sheet Statement';

    return {
      ...commonMeta,
      sheetName,
      formattedAsDate,
      formattedDateRange,
    };
  }
}
