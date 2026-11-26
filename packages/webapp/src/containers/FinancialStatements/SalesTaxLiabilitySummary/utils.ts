import moment from 'moment';
import intl from 'react-intl-universal';
import * as Yup from 'yup';
import { useAccountingReportQuery } from '../useAccountingReportQuery';
import { salesTaxLiabilitySummaryDynamicColumns } from './dynamicColumns';
import { useSalesTaxLiabilitySummaryContext } from './SalesTaxLiabilitySummaryBoot';
import type { AccountingBasis } from '@/hooks/query/settings';
import { transformToForm } from '@/utils';

/**
 * Retrieves the default sales tax liability summary query.
 */
export const getDefaultSalesTaxLiablitySummaryQuery = (
  basis: AccountingBasis,
) => ({
  fromDate: moment().startOf('month').format('YYYY-MM-DD'),
  toDate: moment().format('YYYY-MM-DD'),
  basis,
  numberFormat: {},
});

/**
 * Parses the sales tax liability summary query.
 */
const parseSalesTaxLiabilitySummaryQuery = (
  locationQuery: Record<string, unknown>,
  basis: AccountingBasis,
) => {
  const defaultQuery = getDefaultSalesTaxLiablitySummaryQuery(basis);

  return {
    ...defaultQuery,
    ...transformToForm(locationQuery, defaultQuery),
  };
};

/**
 * Retrieves the sales tax liability summary query.
 */
export const useSalesTaxLiabilitySummaryQuery = () => {
  const { query, setLocationQuery } = useAccountingReportQuery(
    parseSalesTaxLiabilitySummaryQuery,
  );
  return [query, setLocationQuery] as const;
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
