import { PurchasesByItemsTableQuery } from '@bigcapital/sdk-ts';
import { castArray } from 'lodash';
import moment from 'moment';
import React from 'react';
import intl from 'react-intl-universal';
import * as Yup from 'yup';
import { useAppQueryString } from '@/hooks';
import { transformToForm } from '@/utils';

/**
 * Retrieves the purchases by items query.
 */
export const getDefaultPurchasesByItemsQuery = () => ({
  fromDate: moment().startOf('month').format('YYYY-MM-DD'),
  toDate: moment().format('YYYY-MM-DD'),
  filterByOption: 'with-transactions',
  itemsIds: [] as number[],
});

/**
 * Retrieves the purchases by items query validation schema.
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
const parsePurchasesByItemsQuery = (
  locationQuery: Record<string, unknown>,
): PurchasesByItemsTableQuery => {
  const defaultQuery = getDefaultPurchasesByItemsQuery();
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
