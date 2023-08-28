// @ts-nocheck
import React from 'react';
import moment from 'moment';
import * as Yup from 'yup';
import intl from 'react-intl-universal';
import { useAppQueryString } from '@/hooks';
import { transformToForm } from '@/utils';
import { castArray } from 'lodash';

/**
 * Retrieves the purchases by items query.
 */
export const getDefaultPurchasesByItemsQuery = () => ({
  fromDate: moment().startOf('month').format('YYYY-MM-DD'),
  toDate: moment().format('YYYY-MM-DD'),
  filterByOption: 'with-transactions',
  itemsIds: [],
});

/**
 * Retrieves the purchases by items query validation schema.
 * @returns {Yup}
 */
export const getPurchasesByItemsQuerySchema = () => {
  return Yup.object().shape({
    fromDate: Yup.date().required().label(intl.get('from_date')),
    toDate: Yup.date()
      .min(Yup.ref('fromDate'))
      .required()
      .label(intl.get('to_date')),
  });
};

/**
 * Parses the purchases by items query.
 */
const parsePurchasesByItemsQuery = (locationQuery) => {
  const defaultQuery = getDefaultPurchasesByItemsQuery();

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
 * Purchases by items query state.
 */
export const usePurchasesByItemsQuery = () => {
  // Retrieves location query.
  const [locationQuery, setLocationQuery] = useAppQueryString();

  const query = React.useMemo(
    () => parsePurchasesByItemsQuery(locationQuery),
    [locationQuery],
  );
  return { query, locationQuery, setLocationQuery };
};
