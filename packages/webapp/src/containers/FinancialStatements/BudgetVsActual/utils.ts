import moment from 'moment';
import { useMemo } from 'react';
import intl from 'react-intl-universal';
import * as Yup from 'yup';
import { useBudgetVsActualContext } from './BudgetVsActualBoot';
import { budgetVsActualDynamicColumns } from './dynamicColumns';
import { useAppQueryString } from '@/hooks';
import { transformToForm } from '@/utils';

/**
 * Retrieves the default budget vs actual query.
 */
export const getDefaultBudgetVsActualQuery = () => ({
  budgetId: '',
  displayColumnsType: 'month',
  fromDate: '',
  toDate: '',
  numberFormat: {},
});

/**
 * Parses the budget vs actual query.
 */
const parseBudgetVsActualQuery = (locationQuery: Record<string, any>) => {
  const defaultQuery = getDefaultBudgetVsActualQuery();

  return {
    ...defaultQuery,
    ...transformToForm(locationQuery, defaultQuery),
  };
};

/**
 * Retrieves the budget vs actual query.
 */
export const useBudgetVsActualQuery = () => {
  // Retrieves location query.
  const [locationQuery, setLocationQuery] = useAppQueryString();

  // Merges the default filter query with location URL query.
  const parsedQuery = useMemo(
    () => parseBudgetVsActualQuery(locationQuery),
    [locationQuery],
  );
  return [parsedQuery, setLocationQuery] as const;
};

/**
 * Retrieves the budget vs actual default query.
 */
export const getBudgetVsActualDefaultQuery = () => {
  return {
    ...getDefaultBudgetVsActualQuery(),
    fromDate: moment().startOf('year').toDate(),
    toDate: moment().endOf('year').toDate(),
  };
};

/**
 * Retrieves the budget vs actual query validation.
 */
export const getBudgetVsActualQueryValidation = () =>
  Yup.object().shape({
    budgetId: Yup.number()
      .required()
      .label(intl.get('budget_vs_actual.filter_budget')),
    fromDate: Yup.date().optional().label(intl.get('fromDate')),
    toDate: Yup.date()
      .min(Yup.ref('fromDate'))
      .optional()
      .label(intl.get('toDate')),
  });

/**
 * Retrieves the budget vs actual table columns.
 */
export const useBudgetVsActualColumns = () => {
  const { budgetVsActual } = useBudgetVsActualContext();
  const table = (budgetVsActual as any)?.table;

  return budgetVsActualDynamicColumns(table?.columns, table?.rows);
};
