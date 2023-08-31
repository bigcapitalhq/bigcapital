// @ts-nocheck
import React from 'react';
import moment from 'moment';
import * as Yup from 'yup';
import { castArray } from 'lodash';
import intl from 'react-intl-universal';
import { transformToForm } from '@/utils';
import { useAppQueryString } from '@/hooks';
import { salesTaxLiabilitySummaryDynamicColumns } from './dynamicColumns';
import { useSalesTaxLiabilitySummaryContext } from './SalesTaxLiabilitySummaryBoot';

/**
 * Retrieves the default sales tax liability summary query.
 * @returns {}
 */
export const getDefaultSalesTaxLiablitySummaryQuery = () => ({
  fromDate: moment().startOf('month').format('YYYY-MM-DD'),
  toDate: moment().format('YYYY-MM-DD'),
  basis: 'cash',
});

/**
 * Parses the sales tax liability summary query.
 */
const parseSalesTaxLiabilitySummaryQuery = (locationQuery) => {
  const defaultQuery = getDefaultSalesTaxLiablitySummaryQuery();

  const transformed = {
    ...defaultQuery,
    ...transformToForm(locationQuery, defaultQuery),
  };
  return {
    ...transformed,

    // Ensures the branches ids is always array.
    branchesIds: castArray(transformed.branchesIds),
  };
};

/**
 * Retrieves the sales tax liability summary query.
 */
export const useSalesTaxLiabilitySummaryQuery = () => {
  // Retrieves location query.
  const [locationQuery, setLocationQuery] = useAppQueryString();

  // Merges the default filter query with location URL query.
  const parsedQuery = React.useMemo(
    () => parseSalesTaxLiabilitySummaryQuery(locationQuery),
    [locationQuery],
  );
  return [parsedQuery, setLocationQuery];
};

/**
 * Retrieves the sales tax liability summary default query.
 */
export const getSalesTaxLiabilitySummaryDefaultQuery = () => {
  return {
    basic: 'cash',
    fromDate: moment().toDate(),
    toDate: moment().toDate(),
  };
};

/**
 * Retrieves the sales tax liability summary query validation.
 */
export const getSalesTaxLiabilitySummaryQueryValidation = () =>
  Yup.object().shape({
    dateRange: Yup.string().optional(),
    fromDate: Yup.date().required().label(intl.get('fromDate')),
    toDate: Yup.date()
      .min(Yup.ref('fromDate'))
      .required()
      .label(intl.get('toDate')),
  });

/**
 * Retrieves the sales tax liability summary columns.
 * @returns {ITableColumn[]}
 */
export const useSalesTaxLiabilitySummaryColumns = () => {
  const {
    salesTaxLiabilitySummary: { table },
  } = useSalesTaxLiabilitySummaryContext();

  return salesTaxLiabilitySummaryDynamicColumns(table.columns, table.rows);
};
