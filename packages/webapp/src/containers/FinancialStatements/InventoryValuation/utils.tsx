import { InventoryValuationTableQuery } from '@bigcapital/sdk-ts';
import { castArray } from 'lodash';
import moment from 'moment';
import React from 'react';
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
  itemsIds: [] as number[],
  branchesIds: [] as number[],
  warehousesIds: [] as number[],
});

/**
 * Parses inventory valuation location query to report query.
 */
const parseInventoryValuationQuery = (
  locationQuery: Record<string, unknown>,
): InventoryValuationTableQuery => {
  const defaultQuery = getInventoryValuationQuery();
  const transformed = {
    ...defaultQuery,
    ...transformToForm(locationQuery, defaultQuery),
  };
  return {
    ...transformed,

    // Ensures the branches/warehouses ids is always array.
    itemsIds: castArray(transformed.itemsIds).map(Number),
    branchesIds: castArray(transformed.branchesIds).map(Number),
    warehousesIds: castArray(transformed.warehousesIds).map(Number),
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
