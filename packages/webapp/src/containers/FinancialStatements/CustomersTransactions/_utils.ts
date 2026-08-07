import { TransactionsByCustomersTableQuery } from '@bigcapital/sdk-ts';
import { castArray } from 'lodash';
import moment from 'moment';
import { useMemo } from 'react';
import intl from 'react-intl-universal';
import * as Yup from 'yup';
import { useAppQueryString } from '@/hooks';
import { transformToForm } from '@/utils';

export const getCustomersTransactionsQuerySchema = () => {
  return Yup.object().shape({
    fromDate: Yup.date().required().label(intl.get('fromDate')),
    toDate: Yup.date()
      .min(Yup.ref('fromDate'))
      .required()
      .label(intl.get('toDate')),
  });
};

export const getCustomersTransactionsDefaultQuery = () => ({
  fromDate: moment().startOf('month').format('YYYY-MM-DD'),
  toDate: moment().format('YYYY-MM-DD'),
  customersIds: [] as string[],
  filterByOption: 'with-transactions',
});

const parseCustomersTransactionsQuery = (
  query: Record<string, any>,
): TransactionsByCustomersTableQuery => {
  const defaultQuery = getCustomersTransactionsDefaultQuery();

  const transformedQuery = {
    ...defaultQuery,
    ...transformToForm(query, defaultQuery),
  };
  return {
    ...transformedQuery,
    customersIds: castArray(transformedQuery.customersIds).map(Number),
  };
};

export const useCustomersTransactionsQuery = () => {
  const [locationQuery, setLocationQuery] = useAppQueryString();

  const query = useMemo(
    () => parseCustomersTransactionsQuery(locationQuery),
    [locationQuery],
  );
  return [query, setLocationQuery] as const;
};
