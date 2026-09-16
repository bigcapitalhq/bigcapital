import * as moment from 'moment';
import { merge } from 'lodash';
import { SalesTaxLiabilitySummaryQuery } from './SalesTaxLiability.types';

/**
 * Retrieves the default sales tax liability summary query.
 * @returns {SalesTaxLiabilitySummaryQuery}
 */
export const getSalesTaxLiabilityDefaultQuery =
  (): SalesTaxLiabilitySummaryQuery => ({
    fromDate: moment().startOf('month').format('YYYY-MM-DD'),
    toDate: moment().format('YYYY-MM-DD'),
    basis: 'cash',
    numberFormat: {},
  });

/**
 * Merges the given query with the default sales tax liability summary query.
 * @param {SalesTaxLiabilitySummaryQuery} query
 * @returns {SalesTaxLiabilitySummaryQuery}
 */
export const mergeSalesTaxLiabilityQueryWithDefaults = (
  query: SalesTaxLiabilitySummaryQuery,
): SalesTaxLiabilitySummaryQuery => {
  return merge(getSalesTaxLiabilityDefaultQuery(), query);
};
