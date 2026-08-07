import { TransactionsByVendorsTableQuery } from '@bigcapital/sdk-ts';
import moment from 'moment';
import { useMemo } from 'react';
import intl from 'react-intl-universal';
import * as Yup from 'yup';
import { useAppQueryString } from '@/hooks';
import { transformToForm } from '@/utils';

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
  vendorsIds: [] as string[],
});

/**
 * Parses the query of vendors transactions.
 */
const parseVendorsTransactionsQuery = (
  query: Record<string, unknown>,
): TransactionsByVendorsTableQuery => {
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
  return [query, setLocationQuery] as const;
};
