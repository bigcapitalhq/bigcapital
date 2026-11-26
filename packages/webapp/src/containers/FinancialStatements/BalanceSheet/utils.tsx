import { BalanceSheetTableQuery } from '@bigcapital/sdk-ts';
import { castArray } from 'lodash';
import moment from 'moment';
import React from 'react';
import intl from 'react-intl-universal';
import * as Yup from 'yup';
import { useAccountingReportQuery } from '../useAccountingReportQuery';
import type { AccountingBasis } from '@/hooks/query/settings';
import type { FormikContextType } from 'formik';
import { transformToForm } from '@/utils';

interface FormSetFieldValue {
  setFieldValue: FormikContextType<Record<string, unknown>>['setFieldValue'];
}

/**
 * The balance sheet form query — the SDK table query extended with the
 * UI-only filter field.
 */
type BalanceSheetFormQuery = BalanceSheetTableQuery & {
  filterByOption: string;
};

/**
 * Retrieves the default balance sheet query.
 * @returns {}
 */
export const getDefaultBalanceSheetQuery = (
  basis: AccountingBasis,
): BalanceSheetFormQuery => ({
  fromDate: moment().startOf('year').format('YYYY-MM-DD'),
  toDate: moment().format('YYYY-MM-DD'),
  basis,
  displayColumnsType: 'total',
  displayColumnsBy: 'month',
  filterByOption: 'without-zero-balance',

  previousYear: false,
  previousYearAmountChange: false,
  previousYearPercentageChange: false,

  previousPeriod: false,
  previousPeriodAmountChange: false,
  previousPeriodPercentageChange: false,

  // Percentage columns.
  percentageOfColumn: false,
  percentageOfRow: false,

  branchesIds: [],
  // Declared required by the API spec but unused by the server.
  accountIds: [],
  numberFormat: {},

  // Columns sorting.
  columnSortBy: undefined,
  sortOrder: undefined,
});

const parseBalanceSheetQuery = (
  locationQuery: Record<string, unknown>,
  basis: AccountingBasis,
): BalanceSheetFormQuery => {
  const defaultQuery = getDefaultBalanceSheetQuery(basis);
  const transformed = {
    ...defaultQuery,
    ...transformToForm(locationQuery, defaultQuery),
  };
  return {
    ...transformed,
    // Ensures the branches ids is always array.
    branchesIds: castArray(transformed.branchesIds).map(Number),
  };
};

/**
 * Retrieves the balance sheet query.
 */
export const useBalanceSheetQuery = () =>
  useAccountingReportQuery(parseBalanceSheetQuery);

/**
 * Retrieves the balance sheet header validation schema.
 */
export const getBalanceSheetHeaderValidationSchema = () =>
  Yup.object().shape({
    dateRange: Yup.string().optional(),
    fromDate: Yup.date().required().label(intl.get('fromDate')),
    toDate: Yup.date()
      .min(Yup.ref('fromDate'))
      .required()
      .label(intl.get('toDate')),
    filterByOption: Yup.string(),
    displayColumnsType: Yup.string(),
  });

export const handlePreviousYearCheckBoxChange =
  (form: FormSetFieldValue) => (event: React.ChangeEvent<HTMLInputElement>) => {
    const isChecked = event.currentTarget.checked;
    form.setFieldValue('previousYear', isChecked);

    if (!isChecked) {
      form.setFieldValue('previousYearAmountChange', isChecked);
      form.setFieldValue('previousYearPercentageChange', isChecked);
    }
  };

export const handlePreviousPeriodCheckBoxChange =
  (form: FormSetFieldValue) => (event: React.ChangeEvent<HTMLInputElement>) => {
    const isChecked = event.currentTarget.checked;
    form.setFieldValue('previousPeriod', isChecked);

    if (!isChecked) {
      form.setFieldValue('previousPeriodAmountChange', isChecked);
      form.setFieldValue('previousPeriodPercentageChange', isChecked);
    }
  };

export const handlePreviousYearChangeCheckboxChange =
  (form: FormSetFieldValue) => (event: React.ChangeEvent<HTMLInputElement>) => {
    const isChecked = event.currentTarget.checked;

    if (isChecked) {
      form.setFieldValue('previousYear', event.currentTarget.checked);
    }
    form.setFieldValue('previousYearAmountChange', event.currentTarget.checked);
  };

export const handlePreviousYearPercentageCheckboxChange =
  (form: FormSetFieldValue) => (event: React.ChangeEvent<HTMLInputElement>) => {
    const isChecked = event.currentTarget.checked;

    if (isChecked) {
      form.setFieldValue('previousYear', event.currentTarget.checked);
    }
    form.setFieldValue('previousYearPercentageChange', isChecked);
  };

export const handlePreivousPeriodPercentageCheckboxChange =
  (form: FormSetFieldValue) => (event: React.ChangeEvent<HTMLInputElement>) => {
    const isChecked = event.currentTarget.checked;

    if (isChecked) {
      form.setFieldValue('previousPeriod', isChecked);
    }
    form.setFieldValue('previousPeriodPercentageChange', isChecked);
  };

export const handlePreviousPeriodChangeCheckboxChange =
  (form: FormSetFieldValue) => (event: React.ChangeEvent<HTMLInputElement>) => {
    const isChecked = event.currentTarget.checked;

    if (isChecked) {
      form.setFieldValue('previousPeriod', isChecked);
    }
    form.setFieldValue('previousPeriodAmountChange', isChecked);
  };
