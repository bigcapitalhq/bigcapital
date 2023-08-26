// @ts-nocheck
import moment from 'moment';
import * as Yup from 'yup';
import { transformToCamelCase, flatObject, transformToForm } from '@/utils';
import { useAppQueryString } from '@/hooks';
import { useMemo } from 'react';
import { castArray } from 'lodash';

export const transfromFilterFormToQuery = (form) => {
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
    filterByOption: 'without-zero-balance',
    customersIds: [],
    branchesIds: [],
  };
};

/**
 * Retrieves the AR aging summary query schema.
 * @returns {Yup}
 */
export const getARAgingSummaryQuerySchema = () => {
  return Yup.object().shape({
    asDate: Yup.date().required().label('asDate'),
    agingDaysBefore: Yup.number()
      .required()
      .integer()
      .positive()
      .label('Aging days before')
      .min(1)
      .max(500),
    agingPeriods: Yup.number()
      .required()
      .integer()
      .positive()
      .max(12)
      .min(1)
      .label('Aging periods'),
  });
};

/**
 * Parses the AR aging summary state.
 */
const parseARAgingSummaryQuery = (locationQuery) => {
  const defaultQuery = getDefaultARAgingSummaryQuery();
  const transformed = {
    ...defaultQuery,
    ...transformToForm(locationQuery, defaultQuery),
  };
  return {
    ...transformed,
    branchesIds: castArray(transformed.branchesIds),
    customersIds: castArray(transformed.customersIds),
  };
};

/**
 * AR aging summary query state.
 */
export const useARAgingSummaryQuery = () => {
  const [locationQuery, setLocationQuery] = useAppQueryString();

  const query = useMemo(
    () => parseARAgingSummaryQuery(locationQuery),
    [locationQuery],
  );
  return { query, locationQuery, setLocationQuery };
};
