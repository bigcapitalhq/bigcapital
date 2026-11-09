import { castArray } from 'lodash';
import moment from 'moment';
import { useMemo } from 'react';
import * as Yup from 'yup';
import { useAppQueryString } from '@/hooks';
import { transformToCamelCase, flatObject, transformToForm } from '@/utils';

export const transformFilterFormToQuery = (form: Record<string, unknown>) => {
  return flatObject(transformToCamelCase(form));
};

export const getDefaultAPAgingSummaryQuery = () => {
  return {
    asDate: moment().endOf('day').format('YYYY-MM-DD'),
    agingDaysBefore: 30,
    agingPeriods: 3,
    filterByOption: 'without-zero-balance',
    vendorsIds: [] as string[],
    branchesIds: [] as string[],
    numberFormat: {} as Record<string, unknown>,
  };
};

export const getAPAgingSummaryQuerySchema = () => {
  return Yup.object({
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

const parseAPAgingSummaryQuery = (locationQuery: Record<string, unknown>) => {
  const defaultQuery = getDefaultAPAgingSummaryQuery();

  const transformed = {
    ...defaultQuery,
    ...transformToForm(locationQuery, defaultQuery),
  };
  return {
    ...transformed,
    vendorsIds: castArray(transformed.vendorsIds),
    branchesIds: castArray(transformed.branchesIds),
  };
};

export const useAPAgingSummaryQuery = () => {
  const [locationQuery, setLocationQuery] = useAppQueryString();

  const query = useMemo(
    () => parseAPAgingSummaryQuery(locationQuery),
    [locationQuery],
  );
  return { query, locationQuery, setLocationQuery };
};
