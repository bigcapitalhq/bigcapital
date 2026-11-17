import { InventorySummaryTableQuery } from '@bigcapital/sdk-ts';
import { castArray } from 'lodash';
import moment from 'moment';
import React from 'react';
import intl from 'react-intl-universal';
import * as Yup from 'yup';
import { useAppQueryString } from '@/hooks';
import { transformToForm } from '@/utils';

/**
 * Retrieves the validation schema.
 */
export const getInventorySummaryQueryShema = () => {
  return Yup.object().shape({
    fromDate: Yup.date().required().label(intl.get('from_date')),
    toDate: Yup.date()
      .min(Yup.ref('fromDate'))
      .required()
      .label(intl.get('to_date')),
  });
};

/**
 * Retrieves the default query.
 */
export const getDefaultInventorySummaryQuery = () => ({
  fromDate: moment().startOf('month').format('YYYY-MM-DD'),
  toDate: moment().format('YYYY-MM-DD'),
  filterByOption: 'with-transactions',
  itemsIds: [],
  branchesIds: [],
  warehousesIds: [],
  numberFormat: {},
});

/**
 * Parses inventory summary query of browser location.
 */
const parseInventorySummaryQuery = (
  locationQuery: Record<string, unknown>,
): InventorySummaryTableQuery => {
  const defaultQuery = getDefaultInventorySummaryQuery();
  const transformed = {
    ...defaultQuery,
    ...transformToForm(locationQuery, defaultQuery),
  };
  return {
    ...transformed,
    itemsIds: castArray(transformed.itemsIds).map(String),
    branchesIds: castArray(transformed.branchesIds).map(String),
    warehousesIds: castArray(transformed.warehousesIds).map(String),
  };
};

/**
 * Inventory summary query state.
 */
export const useInventorySummaryQuery = () => {
  // Retrieves location query.
  const [locationQuery, setLocationQuery] = useAppQueryString();

  // Merges the default filter query with location URL query.
  const query = React.useMemo(
    () => parseInventorySummaryQuery(locationQuery),
    [locationQuery],
  );
  return { query, locationQuery, setLocationQuery };
};
