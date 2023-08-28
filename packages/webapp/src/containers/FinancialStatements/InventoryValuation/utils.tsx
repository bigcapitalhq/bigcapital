// @ts-nocheck
import React from 'react';
import moment from 'moment';
import { castArray } from 'lodash';
import * as Yup from 'yup';

import { useAppQueryString } from '@/hooks';
import { transformToForm } from '@/utils';

/**
 * Retrieves the validation schema of inventory valuation query.
 */
export const getInventoryValuationQuerySchema = () => {
  return Yup.object().shape({
    asDate: Yup.date().required().label('asDate'),
  });
};

/**
 * Retrieves the inventory valuation sheet default query.
 */
export const getInventoryValuationQuery = () => ({
  asDate: moment().format('YYYY-MM-DD'),
  filterByOption: 'with-transactions',
  itemsIds: [],
  branchesIds: [],
  warehousesIds: [],
});

/**
 * Parses inventory valuation location query to report query.
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
    itemsIds: castArray(transformed.itemsIds),
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
