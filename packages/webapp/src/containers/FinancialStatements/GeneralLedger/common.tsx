// @ts-nocheck
import React from 'react';
import intl from 'react-intl-universal';
import moment from 'moment';
import { castArray } from 'lodash';

import { useAppQueryString } from '@/hooks';
import { transformToForm } from '@/utils';

// Filters accounts options.
export const filterAccountsOptions = [
  {
    key: 'all-accounts',
    name: intl.get('all_accounts'),
    hint: intl.get('all_accounts_including_with_zero_balance'),
  },
  {
    key: 'with-transactions',
    name: intl.get('accounts_with_transactions'),
    hint: intl.get(
      'include_accounts_once_has_transactions_on_given_date_period',
    ),
  },
];

/**
 * Retrieves the default general ledger query.
 */
export const getDefaultGeneralLedgerQuery = () => {
  return {
    fromDate: moment().startOf('year').format('YYYY-MM-DD'),
    toDate: moment().endOf('year').format('YYYY-MM-DD'),
    basis: 'accrual',
    filterByOption: 'with-transactions',
    branchesIds: [],
    accountsIds: [],
  };
};

/**
 * Parses general ledger query of browser location.
 */
const parseGeneralLedgerQuery = (locationQuery) => {
  const defaultQuery = getDefaultGeneralLedgerQuery();

  const transformed = {
    ...defaultQuery,
    ...transformToForm(locationQuery, defaultQuery),
  };
  return {
    ...transformed,

    // Ensures the branches, accounts ids is always array.
    branchesIds: castArray(transformed.branchesIds),
    accountsIds: castArray(transformed.accountsIds),
  };
};

/**
 * Retrieves the general ledger location query.
 */
export const useGeneralLedgerQuery = () => {
  // Retrieves location query.
  const [locationQuery, setLocationQuery] = useAppQueryString();

  // Merges the default filter query with location URL query.
  const query = React.useMemo(
    () => parseGeneralLedgerQuery(locationQuery),
    [locationQuery],
  );
  return { query, locationQuery, setLocationQuery };
};
