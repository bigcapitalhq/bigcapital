import { castArray } from 'lodash';
import moment from 'moment';
import { useMemo } from 'react';
import * as Yup from 'yup';
import { useAppQueryString } from '@/hooks';
import { transformToCamelCase, flatObject, transformToForm } from '@/utils';

export const transfromFilterFormToQuery = (form: Record<string, unknown>) => {
  return flatObject(transformToCamelCase(form));
};

export const getDefaultARAgingSummaryQuery = () => {
  return {
    asDate: moment().endOf('day').format('YYYY-MM-DD'),
    agingDaysBefore: 30,
    agingPeriods: 3,
    filterByOption: 'without-zero-balance',
    customersIds: [] as string[],
    branchesIds: [] as string[],
    numberFormat: {} as Record<string, unknown>,
  };
};

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

const parseARAgingSummaryQuery = (locationQuery: Record<string, unknown>) => {
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

export const useARAgingSummaryQuery = () => {
  const [locationQuery, setLocationQuery] = useAppQueryString();

  const query = useMemo(
    () => parseARAgingSummaryQuery(locationQuery),
    [locationQuery],
  );
  return { query, locationQuery, setLocationQuery };
};
