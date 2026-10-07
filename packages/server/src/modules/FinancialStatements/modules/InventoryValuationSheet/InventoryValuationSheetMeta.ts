import * as moment from 'moment';
import { FinancialSheetMeta } from '../../common/FinancialSheetMeta';
import {
  IInventoryValuationSheetMeta,
  IInventoryValuationReportQuery,
} from './InventoryValuationSheet.types';
import { Injectable } from '@nestjs/common';
import { I18nService } from 'nestjs-i18n';

@Injectable()
export class InventoryValuationMetaInjectable {
  constructor(
    private readonly financialSheetMeta: FinancialSheetMeta,
    private readonly i18n: I18nService,
  ) {}

  /**
   * Retrieve the balance sheet meta.
   * @returns {Promise<IInventoryValuationSheetMeta>}
   */
  public async meta(
    query: IInventoryValuationReportQuery,
  ): Promise<IInventoryValuationSheetMeta> {
    const commonMeta = await this.financialSheetMeta.meta();
    const formattedAsDate = moment(query.asDate).format(commonMeta.dateFormat);
    const asLabel = this.i18n.t('financial_sheet.as_date');
    const formattedDateRange = `${asLabel} ${formattedAsDate}`;

    return {
      ...commonMeta,
      sheetName: this.i18n.t('inventory_valuation.sheet_name'),
      formattedAsDate,
      formattedDateRange,
    };
  }
}
