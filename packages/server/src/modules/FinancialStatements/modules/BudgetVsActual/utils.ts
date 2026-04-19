import { IBudgetVsActualQuery } from './BudgetVsActual.types';
import { BUDGET_VS_ACTUAL_DISPLAY_COLUMNS_TYPE } from './constants';

export const defaultQuery: Partial<IBudgetVsActualQuery> = {
  displayColumnsType: BUDGET_VS_ACTUAL_DISPLAY_COLUMNS_TYPE.TOTAL,
  displayColumnsBy: 'month',
  numberFormat: {
    precision: 2,
    divideOn1000: false,
    showZero: false,
    formatMoney: 'total',
    negativeFormat: 'mines',
  },
};

export const mergeQueryWithDefaults = (
  query: IBudgetVsActualQuery,
): IBudgetVsActualQuery => {
  return {
    ...defaultQuery,
    ...query,
    numberFormat: {
      ...defaultQuery.numberFormat,
      ...(query.numberFormat || {}),
    },
  };
};
