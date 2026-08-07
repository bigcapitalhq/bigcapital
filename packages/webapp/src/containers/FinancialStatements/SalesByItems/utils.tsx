import { SalesByItemsTableQuery } from '@bigcapital/sdk-ts';
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
export const getSalesByItemsQueryShema = () => {
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
export const getDefaultSalesByItemsQuery = () => ({
  fromDate: moment().startOf('month').format('YYYY-MM-DD'),
  toDate: moment().format('YYYY-MM-DD'),
  filterByOption: 'with-transactions',
  itemsIds: [],
});

/**
 * Parses sales by items query of browser location.
 */
const parseSalesByItemsQuery = (
  locationQuery: Record<string, unknown>,
): SalesByItemsTableQuery => {
  const defaultQuery = getDefaultSalesByItemsQuery();
  const transformed = {
    ...defaultQuery,
    ...transformToForm(locationQuery, defaultQuery),
  };
  return {
    ...transformed,
    itemsIds: castArray(transformed.itemsIds).map(Number),
  };
};

/**
 * Sales by items query state.
 */
export const useSalesByItemsQuery = () => {
  // Retrieves location query.
  const [locationQuery, setLocationQuery] = useAppQueryString();

  // Merges the default filter query with location URL query.
  const query = React.useMemo(
    () => parseSalesByItemsQuery(locationQuery),
    [locationQuery],
  );
  return { query, locationQuery, setLocationQuery };
};
