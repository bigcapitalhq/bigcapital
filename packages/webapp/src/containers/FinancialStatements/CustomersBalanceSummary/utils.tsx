// @ts-nocheck
import { useMemo } from 'react';
import { castArray } from 'lodash';
import moment from 'moment';
import * as Yup from 'yup';
import { useAppQueryString } from '@/hooks';
import { getDefaultARAgingSummaryQuery } from '../ARAgingSummary/common';
import { transformToForm } from '@/utils';

export const getDefaultCustomersBalanceQuery = () => {
  return {
    asDate: moment().endOf('day').format('YYYY-MM-DD'),
    filterByOption: 'with-transactions',
    customersIds: [],
  };
};

/**
 * Retrieves the customers balance query schema.
 * @returns {Yup}
 */
export const getCustomersBalanceQuerySchema = () => {
  return Yup.object().shape({
    asDate: Yup.date().required().label('asDate'),
  });
};

/**
 * Parses the customer balance summary query.
 * @returns
 */
const parseCustomersBalanceSummaryQuery = (locationQuery) => {
  const defaultQuery = getDefaultARAgingSummaryQuery();

  const transformed = {
    ...defaultQuery,
    ...transformToForm(locationQuery, defaultQuery),
  };
  return {
    ...transformed,

    // 
    customersIds: castArray(transformed.customersIds),
  };
};

/**
 *
 * @returns
 */
export const useCustomerBalanceSummaryQuery = () => {
  const [locationQuery, setLocationQuery] = useAppQueryString();

  const query = useMemo(
    () => parseCustomersBalanceSummaryQuery(locationQuery),
    [locationQuery],
  );
  return { query, locationQuery, setLocationQuery };
};
