import * as moment from 'moment';
import { Injectable } from '@nestjs/common';
import { I18nService } from 'nestjs-i18n';
import { ModelObject } from 'objection';
import { Budget } from '@/modules/Budgets/models/Budget';
import { FinancialSheetMeta } from '../../common/FinancialSheetMeta';
import {
  IBudgetVsActualMeta,
  IBudgetVsActualQuery,
} from './BudgetVsActual.types';

@Injectable()
export class BudgetVsActualMeta {
  constructor(
    private readonly financialSheetMeta: FinancialSheetMeta,
    private readonly i18n: I18nService,
  ) {}

  /**
   * Retrieves the budget vs actual sheet meta.
   * @param {ModelObject<Budget>} budget - The report budget.
   * @param {IBudgetVsActualQuery} query - The report query.
   * @returns {Promise<IBudgetVsActualMeta>}
   */
  public async meta(
    budget: ModelObject<Budget>,
    query: IBudgetVsActualQuery,
  ): Promise<IBudgetVsActualMeta> {
    const common = await this.financialSheetMeta.meta();

    const formattedFromDate = moment(query.fromDate).format(common.dateFormat);
    const formattedToDate = moment(query.toDate).format(common.dateFormat);
    const fromLabel = this.i18n.t('financial_sheet.from_date');
    const toLabel = this.i18n.t('financial_sheet.to_date');
    const formattedDateRange = `${fromLabel} ${formattedFromDate} | ${toLabel} ${formattedToDate}`;

    return {
      ...common,
      sheetName: this.i18n.t('budget_vs_actual.sheet_name'),
      budgetId: budget.id,
      budgetName: budget.name,
      formattedDateRange,
      formattedFromDate,
      formattedToDate,
    };
  }
}
