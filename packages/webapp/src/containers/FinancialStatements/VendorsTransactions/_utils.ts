// @ts-nocheck
import * as Yup from 'yup';
import intl from 'react-intl-universal';
import moment from 'moment';
import { useMemo } from 'react';
import { transformToForm } from '@/utils';
import { useAppQueryString } from '@/hooks';

/**
 * The validation schema of vendors transactions.
 */
export const getVendorTransactionsQuerySchema = () => {
  return Yup.object().shape({
    fromDate: Yup.date().required().label(intl.get('fromDate')),
    toDate: Yup.date()
      .min(Yup.ref('fromDate'))
      .required()
      .label(intl.get('toDate')),
  });
};

/**
 * Retrieves the default query of vendors transactions.
 */
export const getVendorsTransactionsDefaultQuery = () => ({
  fromDate: moment().startOf('month').format('YYYY-MM-DD'),
  toDate: moment().format('YYYY-MM-DD'),
  vendorsIds: [],
});

/**
 * Parses the query of vendors transactions.
 */
const parseVendorsTransactionsQuery = (query) => {
  const defaultQuery = getVendorsTransactionsDefaultQuery();
  const transformed = {
    ...defaultQuery,
    ...transformToForm(query, defaultQuery),
  };
  return {
    ...transformed,
    vendorsIds: transformed.vendorsIds ? transformed.vendorsIds : [],
  };
};

/**
 * Retrieves the query of vendors transactions.
 */
export const useVendorsTransactionsQuery = () => {
  const [locationQuery, setLocationQuery] = useAppQueryString();

  const query = useMemo(
    () => parseVendorsTransactionsQuery(locationQuery),
    [locationQuery],
  );
  return [query, setLocationQuery];
};
