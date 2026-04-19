import * as moment from 'moment';
import { IBudgetVsActualQuery } from './BudgetVsActual.types';
import { BUDGET_VS_ACTUAL_DISPLAY_COLUMNS_TYPE } from './constants';
import { IAccountTransactionsGroupBy } from '../../types/Report.types';

export class BudgetVsActualQuery {
  readonly query: IBudgetVsActualQuery;

  constructor(query: IBudgetVsActualQuery) {
    this.query = {
      ...query,
      displayColumnsType:
        query.displayColumnsType ||
        BUDGET_VS_ACTUAL_DISPLAY_COLUMNS_TYPE.TOTAL,
      displayColumnsBy: query.displayColumnsBy || 'month',
      numberFormat: query.numberFormat || {
        precision: 2,
        divideOn1000: false,
        showZero: false,
        formatMoney: 'total',
        negativeFormat: 'mines',
      },
    };
  }

  get budgetId(): number {
    return this.query.budgetId;
  }

  get fromDate(): Date | string {
    return this.query.fromDate;
  }

  get toDate(): Date | string {
    return this.query.toDate;
  }

  get displayColumnsType(): string {
    return this.query.displayColumnsType;
  }

  get displayColumnsBy(): string {
    return this.query.displayColumnsBy;
  }

  get accountsIds(): number[] {
    return this.query.accountsIds;
  }

  get branchesIds(): number[] {
    return this.query.branchesIds;
  }

  get numberFormat() {
    return this.query.numberFormat;
  }

  public isDatePeriodsColumnsType = (): boolean => {
    return (
      this.displayColumnsType ===
      BUDGET_VS_ACTUAL_DISPLAY_COLUMNS_TYPE.DATE_PERIODS
    );
  };

  public getGroupByType = (): IAccountTransactionsGroupBy => {
    const pairs = {
      month: IAccountTransactionsGroupBy.Month,
      quarter: IAccountTransactionsGroupBy.Quarter,
      year: IAccountTransactionsGroupBy.Year,
      day: IAccountTransactionsGroupBy.Day,
    };
    return pairs[this.displayColumnsBy] || IAccountTransactionsGroupBy.Month;
  };

  public getPeriodsUnit = (): moment.unitOfTime.StartOf => {
    const pairs = {
      month: 'month' as moment.unitOfTime.StartOf,
      quarter: 'quarter' as moment.unitOfTime.StartOf,
      year: 'year' as moment.unitOfTime.StartOf,
      day: 'day' as moment.unitOfTime.StartOf,
    };
    return pairs[this.displayColumnsBy] || 'month';
  };
}
