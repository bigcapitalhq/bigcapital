import moment from 'moment';
import { Injectable } from '@nestjs/common';
import { FinancialSheetMeta } from '../../common/FinancialSheetMeta';
import { IAgingSummaryMeta, IAgingSummaryQuery } from './AgingSummary.types';

@Injectable()
export class AgingSummaryMeta {
  constructor(private readonly financialSheetMeta: FinancialSheetMeta) {}

  /**
   * Retrieve the aging summary meta.
   * @returns {IBalanceSheetMeta}
   */
  public async meta(query: IAgingSummaryQuery): Promise<IAgingSummaryMeta> {
    const commonMeta = await this.financialSheetMeta.meta();
    const formattedAsDate = moment(query.asDate).format('YYYY/MM/DD');
    const formattedDateRange = `As ${formattedAsDate}`;

    return {
      ...commonMeta,
      sheetName: 'A/P Aging Summary',
      formattedAsDate,
      formattedDateRange,
    };
  }
}
