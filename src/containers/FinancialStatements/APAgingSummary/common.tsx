// @ts-nocheck
import moment from 'moment';
import { transformToCamelCase, flatObject } from '@/utils';

export const transformFilterFormToQuery = (form) => {
  return flatObject(transformToCamelCase(form));
};

export const getDefaultAPAgingSummaryQuery = () => {
  return {
    asDate: moment().endOf('day').format('YYYY-MM-DD'),
    agingDaysBefore: 30,
    agingPeriods: 3,
    vendorsIds: [],
    branchesIds: [],
    filterByOption: 'without-zero-balance',
  }
}