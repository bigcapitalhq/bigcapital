import { Injectable } from '@nestjs/common';
import { FinancialSheetMeta } from '../../common/FinancialSheetMeta';
import { IBudgetVsActualQuery, IBudgetVsActualMeta } from './BudgetVsActual.types';
import * as moment from 'moment';

@Injectable()
export class BudgetVsActualMeta {
  constructor(private readonly financialSheetMeta: FinancialSheetMeta) {}

  public meta = async (
    query: IBudgetVsActualQuery,
    budget: any,
  ): Promise<IBudgetVsActualMeta> => {
    const meta = await this.financialSheetMeta.meta();
    const dateFormat = meta.dateFormat || 'YYYY MMM DD';

    const fromDateVal = query.fromDate || budget.startDate;
    const toDateVal = query.toDate || budget.endDate;

    return {
      ...meta,
      sheetName: 'Budget vs Actual',
      budgetName: budget.name,
      budgetType: budget.budgetType,
      periodType: budget.periodType,
      fromDate: {
        date: moment(fromDateVal).toDate(),
        formattedDate: moment(fromDateVal).format(dateFormat),
      },
      toDate: {
        date: moment(toDateVal).toDate(),
        formattedDate: moment(toDateVal).format(dateFormat),
      },
    };
  };
}
