import * as moment from 'moment';
import { Injectable } from '@nestjs/common';
import { I18nService } from 'nestjs-i18n';
import { FinancialSheetMeta } from '../../common/FinancialSheetMeta';
import {
  IPurchasesByItemsReportQuery,
  IPurchasesByItemsSheetMeta,
} from './types/PurchasesByItems.types';

@Injectable()
export class PurchasesByItemsMeta {
  constructor(
    private financialSheetMetaModel: FinancialSheetMeta,
    private readonly i18n: I18nService,
  ) {}

  /**
   * Retrieve the purchases by items meta.
   * @param {IPurchasesByItemsReportQuery} query
   * @returns {IPurchasesByItemsSheetMeta}
   */
  public async meta(
    query: IPurchasesByItemsReportQuery,
  ): Promise<IPurchasesByItemsSheetMeta> {
    const commonMeta = await this.financialSheetMetaModel.meta();
    const formattedToDate = moment(query.toDate).format(commonMeta.dateFormat);
    const formattedFromDate = moment(query.fromDate).format(
      commonMeta.dateFormat,
    );
    const fromLabel = this.i18n.t('financial_sheet.from_date');
    const toLabel = this.i18n.t('financial_sheet.to_date');
    const formattedDateRange = `${fromLabel} ${formattedFromDate} | ${toLabel} ${formattedToDate}`;

    return {
      ...commonMeta,
      sheetName: this.i18n.t('purchases_by_items.sheet_name'),
      formattedFromDate,
      formattedToDate,
      formattedDateRange,
    };
  }
}
