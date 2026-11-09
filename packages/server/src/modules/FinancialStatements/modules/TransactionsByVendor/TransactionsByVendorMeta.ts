import * as moment from 'moment';
import {
  ITransactionsByVendorMeta,
  ITransactionsByVendorsFilter,
} from './TransactionsByVendor.types';
import { Injectable } from '@nestjs/common';
import { I18nService } from 'nestjs-i18n';
import { FinancialSheetMeta } from '../../common/FinancialSheetMeta';

@Injectable()
export class TransactionsByVendorMeta {
  constructor(
    private readonly financialSheetMeta: FinancialSheetMeta,
    private readonly i18n: I18nService,
  ) {}

  /**
   * Retrieves the transactions by vendor meta.
   * @returns {Promise<ITransactionsByVendorMeta>}
   */
  public async meta(
    query: ITransactionsByVendorsFilter,
  ): Promise<ITransactionsByVendorMeta> {
    const commonMeta = await this.financialSheetMeta.meta();

    const formattedToDate = moment(query.toDate).format(commonMeta.dateFormat);
    const formattedFromDate = moment(query.fromDate).format(
      commonMeta.dateFormat,
    );
    const fromLabel = this.i18n.t('financial_sheet.from_date');
    const toLabel = this.i18n.t('financial_sheet.to_date');
    const formattedDateRange = `${fromLabel} ${formattedFromDate} | ${toLabel} ${formattedToDate}`;

    const sheetName = this.i18n.t('transactions_by_contact.vendors_sheet_name');

    return {
      ...commonMeta,
      sheetName,
      formattedFromDate,
      formattedToDate,
      formattedDateRange,
    };
  }
}
