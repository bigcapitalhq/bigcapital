// @ts-nocheck
import moment from 'moment';
import { transformToCamelCase, flatObject } from '@/utils';

export const transformFilterFormToQuery = (form) => {
  return flatObject(transformToCamelCase(form));
};

/**
 * Retrieves the default A/R aging summary query.
 */
export const getDefaultARAgingSummaryQuery = () => {
  return {
    asDate: moment().endOf('day').format('YYYY-MM-DD'),
    agingDaysBefore: 30,
    agingPeriods: 3,
    customersIds: [],
    filterByOption: 'without-zero-balance',
    branchesIds: [],
  };
};
