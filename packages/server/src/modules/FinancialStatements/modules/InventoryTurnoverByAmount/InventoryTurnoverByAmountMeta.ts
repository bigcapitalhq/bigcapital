import { Injectable } from '@nestjs/common';
import * as moment from 'moment';
import { I18nService } from 'nestjs-i18n';
import { FinancialSheetMeta } from '../../common/FinancialSheetMeta';
import {
  IInventoryTurnoverByAmountMeta,
  IInventoryTurnoverByAmountQuery,
} from './InventoryTurnoverByAmount.types';

@Injectable()
export class InventoryTurnoverByAmountMeta {
  constructor(
    private readonly financialSheetMeta: FinancialSheetMeta,
    private readonly i18n: I18nService,
  ) {}

  /**
   * Retrieve the inventory turnover report meta.
   * @param {IInventoryTurnoverByAmountQuery} query
   * @returns {Promise<IInventoryTurnoverByAmountMeta>}
   */
  public async meta(
    query: IInventoryTurnoverByAmountQuery,
  ): Promise<IInventoryTurnoverByAmountMeta> {
    const commonMeta = await this.financialSheetMeta.meta();

    const formattedFromDate = moment(query.fromDate).format(
      commonMeta.dateFormat,
    );
    const formattedToDate = moment(query.toDate).format(commonMeta.dateFormat);
    const fromLabel = this.i18n.t('financial_sheet.from_date');
    const toLabel = this.i18n.t('financial_sheet.to_date');
    const formattedDateRange = `${fromLabel} ${formattedFromDate} | ${toLabel} ${formattedToDate}`;

    const sheetName = this.i18n.t('inventory_turnover_by_amount.sheet_name');

    return {
      ...commonMeta,
      sheetName,
      formattedFromDate,
      formattedToDate,
      formattedDateRange,
    };
  }
}
