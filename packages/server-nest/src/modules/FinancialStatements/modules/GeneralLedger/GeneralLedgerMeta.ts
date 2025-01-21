import * as moment from 'moment';
import { Injectable } from '@nestjs/common';
import {
  IGeneralLedgerMeta,
  IGeneralLedgerSheetQuery,
} from './GeneralLedger.types';
import { FinancialSheetMeta } from '../../common/FinancialSheetMeta';

@Injectable()
export class GeneralLedgerMeta {
  constructor(private readonly financialSheetMeta: FinancialSheetMeta) {}

  /**
   * Retrieve the general ledger meta.
   * @returns {IGeneralLedgerMeta}
   */
  public async meta(
    query: IGeneralLedgerSheetQuery,
  ): Promise<IGeneralLedgerMeta> {
    const commonMeta = await this.financialSheetMeta.meta();

    const formattedToDate = moment(query.toDate).format('YYYY/MM/DD');
    const formattedFromDate = moment(query.fromDate).format('YYYY/MM/DD');
    const formattedDateRange = `From ${formattedFromDate} | To ${formattedToDate}`;

    return {
      ...commonMeta,
      sheetName: 'Balance Sheet',
      formattedFromDate,
      formattedToDate,
      formattedDateRange,
    };
  }
}
