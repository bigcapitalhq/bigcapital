// @ts-nocheck
import React from 'react';
import moment from 'moment';
import { castArray } from 'lodash';

import { useAppQueryString } from '@/hooks';
import { transformToForm } from '@/utils';

/**
 * Retrieves the inventory valuation sheet default query.
 */
export const getInventoryValuationQuery = () => {
  return {
    asDate: moment().endOf('day').format('YYYY-MM-DD'),
    filterByOption: 'with-transactions',

    branchesIds: [],
    warehousesIds: [],
  };
};

/**
 * Parses inventory validation location query to report query.
 */
const parseInventoryValuationQuery = (locationQuery) => {
  const defaultQuery = getInventoryValuationQuery();

  const transformed = {
    ...defaultQuery,
    ...transformToForm(locationQuery, defaultQuery),
  };
  return {
    ...transformed,

    // Ensures the branches/warehouses ids is always array.
    branchesIds: castArray(transformed.branchesIds),
    warehousesIds: castArray(transformed.warehousesIds),
  };
};

/**
 * Retrieves the inventory valuation sheet location query.
 */
export const useInventoryValuationQuery = () => {
  // Retrieves location query.
  const [locationQuery, setLocationQuery] = useAppQueryString();

  // Merges the default filter query with location URL query.
  const query = React.useMemo(
    () => parseInventoryValuationQuery(locationQuery),
    [locationQuery],
  );

  return {
    query,
    locationQuery,
    setLocationQuery,
  };
};
