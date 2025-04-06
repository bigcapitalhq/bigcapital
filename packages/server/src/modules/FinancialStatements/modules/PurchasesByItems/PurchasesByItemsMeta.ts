import * as moment from 'moment';
import { Injectable } from '@nestjs/common';
import { FinancialSheetMeta } from '../../common/FinancialSheetMeta';
import {
  IPurchasesByItemsReportQuery,
  IPurchasesByItemsSheetMeta,
} from './types/PurchasesByItems.types';

@Injectable()
export class PurchasesByItemsMeta {
  constructor(
    private financialSheetMetaModel: FinancialSheetMeta,
  ) {}

  /**
   * Retrieve the purchases by items meta.
   * @param {IPurchasesByItemsReportQuery} query
   * @returns {IPurchasesByItemsSheetMeta}
   */
  public async meta(
    query: IPurchasesByItemsReportQuery
  ): Promise<IPurchasesByItemsSheetMeta> {
    const commonMeta = await this.financialSheetMetaModel.meta();
    const formattedToDate = moment(query.toDate).format('YYYY/MM/DD');
    const formattedFromDate = moment(query.fromDate).format('YYYY/MM/DD');
    const formattedDateRange = `From ${formattedFromDate} | To ${formattedToDate}`;

    return {
      ...commonMeta,
      sheetName: 'Purchases By Items',
      formattedFromDate,
      formattedToDate,
      formattedDateRange,
    };
  }
}
