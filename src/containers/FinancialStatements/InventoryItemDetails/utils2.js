import React from 'react';
import { castArray } from 'lodash';
import moment from 'moment';

import { useAppQueryString } from 'hooks';
import { transformToForm } from 'utils';

/**
 * Retrieves inventory item details default query.
 */
export const getInventoryItemDetailsDefaultQuery = () => {
  return {
    fromDate: moment().startOf('year').format('YYYY-MM-DD'),
    toDate: moment().endOf('year').format('YYYY-MM-DD'),
    warehousesIds: [],
    branchesIds: [],
  };
};

/**
 * Parses inventory item details browser location query.
 */
const parseInventoryItemDetailsQuery = (locationQuery) => {
  const defaultQuery = getInventoryItemDetailsDefaultQuery();

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
 * State setter/getter of inventory valuation browser location query.
 */
export const useInventoryValuationQuery = () => {
  // Retrieves location query.
  const [locationQuery, setLocationQuery] = useAppQueryString();

  // Merges the default filter query with location URL query.
  const query = React.useMemo(
    () => parseInventoryItemDetailsQuery(locationQuery),
    [locationQuery],
  );

  return {
    query,
    locationQuery,
    setLocationQuery,
  };
};
