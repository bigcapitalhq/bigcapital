import * as moment from 'moment';
import { Injectable } from '@nestjs/common';
import { I18nService } from 'nestjs-i18n';
import { FinancialSheetMeta } from '../../common/FinancialSheetMeta';
import { SalesTaxLiabilitySummaryQuery } from './SalesTaxLiability.types';

@Injectable()
export class SalesTaxLiabilitySummaryMeta {
  constructor(
    private readonly financialSheetMeta: FinancialSheetMeta,
    private readonly i18n: I18nService,
  ) {}

  /**
   * Retrieves the report meta.
   * @param {number} tenantId
   * @param {SalesTaxLiabilitySummaryQuery} filter
   */
  public async meta(query: SalesTaxLiabilitySummaryQuery) {
    const commonMeta = await this.financialSheetMeta.meta();
    const formattedToDate = moment(query.toDate).format(commonMeta.dateFormat);
    const formattedFromDate = moment(query.fromDate).format(
      commonMeta.dateFormat,
    );
    const fromLabel = this.i18n.t('financial_sheet.from_date');
    const toLabel = this.i18n.t('financial_sheet.to_date');
    const formattedDateRange = `${fromLabel} ${formattedFromDate} | ${toLabel} ${formattedToDate}`;

    const sheetName = this.i18n.t('sales_tax_liability_summary.sheet_name');

    return {
      ...commonMeta,
      sheetName,
      formattedFromDate,
      formattedToDate,
      formattedDateRange,
    };
  }
}
