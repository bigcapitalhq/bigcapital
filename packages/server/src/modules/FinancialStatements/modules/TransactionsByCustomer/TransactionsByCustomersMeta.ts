import * as moment from 'moment';
import { Injectable } from '@nestjs/common';
import { I18nService } from 'nestjs-i18n';
import { FinancialSheetMeta } from '../../common/FinancialSheetMeta';
import {
  ITransactionsByCustomersFilter,
  ITransactionsByCustomersMeta,
} from './TransactionsByCustomer.types';

@Injectable()
export class TransactionsByCustomersMeta {
  constructor(
    private readonly financialSheetMeta: FinancialSheetMeta,
    private readonly i18n: I18nService,
  ) {}

  /**
   * Retrieves the transactions by customers meta.
   * @param {ITransactionsByCustomersFilter} query - Transactions by customers filter.
   * @returns {ITransactionsByCustomersMeta}
   */
  public async meta(
    query: ITransactionsByCustomersFilter,
  ): Promise<ITransactionsByCustomersMeta> {
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
      sheetName: this.i18n.t('transactions_by_contact.customers_sheet_name'),
      formattedFromDate,
      formattedToDate,
      formattedDateRange,
    };
  }
}
