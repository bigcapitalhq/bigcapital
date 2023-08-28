// @ts-nocheck
import React from 'react';
import moment from 'moment';
import * as Yup from 'yup';
import intl from 'react-intl-universal';
import { castArray } from 'lodash';
import { useAppQueryString } from '@/hooks';
import { transformToForm } from '@/utils';

/**
 * Retrieves the validation schema.
 * @returns {Yup}
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
const parseSalesByItemsQuery = (locationQuery) => {
  const defaultQuery = getDefaultSalesByItemsQuery();

  const transformed = {
    ...defaultQuery,
    ...transformToForm(locationQuery, defaultQuery),
  };
  return {
    ...transformed,
    itemsIds: castArray(transformed.itemsIds),
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
