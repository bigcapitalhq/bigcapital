// @ts-nocheck
import moment from 'moment';
import * as Yup from 'yup';
import { transformToCamelCase, flatObject, transformToForm } from '@/utils';
import { useAppQueryString } from '@/hooks';
import { useMemo } from 'react';

export const transformFilterFormToQuery = (form) => {
  return flatObject(transformToCamelCase(form));
};

/**
 *
 * @returns
 */
export const getDefaultAPAgingSummaryQuery = () => {
  return {
    asDate: moment().endOf('day').format('YYYY-MM-DD'),
    agingDaysBefore: 30,
    agingPeriods: 3,
    filterByOption: 'without-zero-balance',
    vendorsIds: [],
    branchesIds: [],
  };
};

/**
 * Retrieves the query validation schema.
 * @returns {Yup}
 */
export const getAPAgingSummaryQuerySchema = () => {
  return Yup.object({
    asDate: Yup.date().required().label('asDate'),
    agingDaysBefore: Yup.number()
      .required()
      .integer()
      .positive()
      .label('agingBeforeDays'),
    agingPeriods: Yup.number()
      .required()
      .integer()
      .positive()
      .label('agingPeriods'),
  });
};

/**
 * 
 * @param locationQuery 
 * @returns 
 */
const parseAPAgingSummaryQuery = (locationQuery) => {
  const defaultQuery = getDefaultAPAgingSummaryQuery();

  const transformed = {
    ...defaultQuery,
    ...transformToForm(locationQuery, defaultQuery),
  };
  return {
    ...transformed,
  };
};

/**
 *
 * @returns
 */
export const useAPAgingSummaryQuery = () => {
  // Retrieves location query.
  const [locationQuery, setLocationQuery] = useAppQueryString();

  // Merges the default filter query with location URL query.
  const query = useMemo(
    () => parseAPAgingSummaryQuery(locationQuery),
    [locationQuery],
  );
  return { query, locationQuery, setLocationQuery };
};
