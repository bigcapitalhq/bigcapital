import * as moment from 'moment';
import { Injectable } from '@nestjs/common';
import { I18nService } from 'nestjs-i18n';
import {
  IGeneralLedgerMeta,
  IGeneralLedgerSheetQuery,
} from './GeneralLedger.types';
import { FinancialSheetMeta } from '../../common/FinancialSheetMeta';

@Injectable()
export class GeneralLedgerMeta {
  constructor(
    private readonly financialSheetMeta: FinancialSheetMeta,
    private readonly i18n: I18nService,
  ) {}

  /**
   * Retrieve the general ledger meta.
   * @returns {IGeneralLedgerMeta}
   */
  public async meta(
    query: IGeneralLedgerSheetQuery,
  ): Promise<IGeneralLedgerMeta> {
    const commonMeta = await this.financialSheetMeta.meta();

    const formattedToDate = moment(query.toDate).format(commonMeta.dateFormat);
    const formattedFromDate = moment(query.fromDate).format(
      commonMeta.dateFormat,
    );
    const fromLabel = this.i18n.t('financial_sheet.from_date');
    const toLabel = this.i18n.t('financial_sheet.to_date');
    const formattedDateRange = `${fromLabel} ${formattedFromDate} | ${toLabel} ${formattedToDate}`;

    return {
      ...commonMeta,
      sheetName: this.i18n.t('general_ledger.sheet_name'),
      formattedFromDate,
      formattedToDate,
      formattedDateRange,
    };
  }
}
