import { Injectable } from '@nestjs/common';
import * as moment from 'moment';
import { I18nService } from 'nestjs-i18n';
import { FinancialSheetMeta } from '../../common/FinancialSheetMeta';
import { IBalanceSheetMeta, IBalanceSheetQuery } from './BalanceSheet.types';

@Injectable()
export class BalanceSheetMetaInjectable {
  constructor(
    private readonly financialSheetMeta: FinancialSheetMeta,
    private readonly i18n: I18nService,
  ) {}

  /**
   * Retrieves the balance sheet meta.
   * @returns {IBalanceSheetMeta}
   */
  public async meta(query: IBalanceSheetQuery): Promise<IBalanceSheetMeta> {
    const commonMeta = await this.financialSheetMeta.meta();
    const formattedAsDate = moment(query.toDate).format(commonMeta.dateFormat);
    const asLabel = this.i18n.t('financial_sheet.as_date');
    const formattedDateRange = `${asLabel} ${formattedAsDate}`;
    const sheetName = this.i18n.t('balance_sheet.sheet_name');

    return {
      ...commonMeta,
      sheetName,
      formattedAsDate,
      formattedDateRange,
    };
  }
}
