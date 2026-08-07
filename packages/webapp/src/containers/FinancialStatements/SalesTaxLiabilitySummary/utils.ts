import { SalesByItemsTableQuery } from '@bigcapital/sdk-ts';
import moment from 'moment';
import React, { useMemo } from 'react';
import intl from 'react-intl-universal';
import * as Yup from 'yup';
import { salesTaxLiabilitySummaryDynamicColumns } from './dynamicColumns';
import { useSalesTaxLiabilitySummaryContext } from './SalesTaxLiabilitySummaryBoot';
import { useAppQueryString } from '@/hooks';
import { transformToForm } from '@/utils';

/**
 * Retrieves the default sales tax liability summary query.
 */
export const getDefaultSalesTaxLiablitySummaryQuery = () => ({
  fromDate: moment().startOf('month').format('YYYY-MM-DD'),
  toDate: moment().format('YYYY-MM-DD'),
  basis: 'cash',
});

/**
 * Parses the sales tax liability summary query.
 */
const parseSalesTaxLiabilitySummaryQuery = (
  locationQuery: Record<string, any>,
): SalesByItemsTableQuery => {
  const defaultQuery = getDefaultSalesTaxLiablitySummaryQuery();

  const transformed = {
    ...defaultQuery,
    ...transformToForm(locationQuery, defaultQuery),
  };
  return {
    ...transformed,

    // Ensures the branches ids is always array.
    // branchesIds: castArray(transformed.branchesIds).map(Number),
  };
};

/**
 * Retrieves the sales tax liability summary query.
 */
export const useSalesTaxLiabilitySummaryQuery = () => {
  // Retrieves location query.
  const [locationQuery, setLocationQuery] = useAppQueryString();

  // Merges the default filter query with location URL query.
  const parsedQuery = useMemo(
    () => parseSalesTaxLiabilitySummaryQuery(locationQuery),
    [locationQuery],
  );
  return [parsedQuery, setLocationQuery] as const;
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
 */
export const useSalesTaxLiabilitySummaryColumns = () => {
  const { salesTaxLiabilitySummary } = useSalesTaxLiabilitySummaryContext();

  const table = (salesTaxLiabilitySummary as any)?.table;

  return salesTaxLiabilitySummaryDynamicColumns(table?.columns, table?.rows);
};
