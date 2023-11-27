// @ts-nocheck
import React from 'react';
import moment from 'moment';
import { castArray } from 'lodash';
import * as Yup from 'yup';
import intl from 'react-intl-universal';

import { useAppQueryString } from '@/hooks';
import { transformToForm } from '@/utils';
import { transformFilterFormToQuery } from '../common';

/**
 * Retrieves inventory item details default query.
 */
export const getInventoryItemDetailsDefaultQuery = () => ({
  fromDate: moment().startOf('month').format('YYYY-MM-DD'),
  toDate: moment().format('YYYY-MM-DD'),
  itemsIds: [],
  warehousesIds: [],
  branchesIds: [],
});

/**
 * Retrieves inventory item details query schema.
 * @returns {Yup}
 */
export const getInventoryItemDetailsQuerySchema = () => {
  return Yup.object().shape({
    fromDate: Yup.date().required().label(intl.get('fromDate')),
    toDate: Yup.date()
      .min(Yup.ref('fromDate'))
      .required()
      .label(intl.get('toDate')),
  });
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

    // Ensure the branches, warehouses and items ids is always array.
    itemsIds: castArray(transformed.itemsIds),
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

/**
 * Retrieves the inventory valuation http query.
 * @returns {Object}
 */
export const useInventoryValuationHttpQuery = () => {
  const { query } = useInventoryValuationQuery();

  return React.useMemo(() => transformFilterFormToQuery(query), [query]);
};
