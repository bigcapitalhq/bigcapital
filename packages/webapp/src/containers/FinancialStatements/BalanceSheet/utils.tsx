import { BalanceSheetTableQuery } from '@bigcapital/sdk-ts';
import { castArray } from 'lodash';
import moment from 'moment';
import * as R from 'ramda';
import React from 'react';
import intl from 'react-intl-universal';
import * as Yup from 'yup';
import type { FormikContextType } from 'formik';
import { useAppQueryString } from '@/hooks';
import { transformToForm } from '@/utils';

interface FormSetFieldValue {
  setFieldValue: FormikContextType<Record<string, unknown>>['setFieldValue'];
}

/**
 * Retrieves the default balance sheet query.
 * @returns {}
 */
export const getDefaultBalanceSheetQuery = (): BalanceSheetTableQuery => ({
  fromDate: moment().startOf('year').format('YYYY-MM-DD'),
  toDate: moment().format('YYYY-MM-DD'),
  basis: 'cash',
  displayColumnsType: 'total',
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
});

const parseBalanceSheetQuery = (
  locationQuery: Record<string, unknown>,
): BalanceSheetTableQuery => {
  const defaultQuery = getDefaultBalanceSheetQuery();
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
export const useBalanceSheetQuery = () => {
  // Retrieves location query.
  const [locationQuery, setLocationQuery] = useAppQueryString();

  // Merges the default filter query with location URL query.
  const query = React.useMemo(
    () => parseBalanceSheetQuery(locationQuery),
    [locationQuery],
  );

  return {
    query,
    locationQuery,
    setLocationQuery,
  };
};

/**
 * Retrieves the balance sheet header default values.
 */
export const getBalanceSheetHeaderDefaultValues = () => {
  return {
    basic: 'cash',
    filterByOption: 'without-zero-balance',
    displayColumnsType: 'total',
    fromDate: moment().toDate(),
    toDate: moment().toDate(),
  };
};

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

export const handlePreviousYearCheckBoxChange = R.curry(
  (form: FormSetFieldValue, event: React.ChangeEvent<HTMLInputElement>) => {
    const isChecked = event.currentTarget.checked;
    form.setFieldValue('previousYear', isChecked);

    if (!isChecked) {
      form.setFieldValue('previousYearAmountChange', isChecked);
      form.setFieldValue('previousYearPercentageChange', isChecked);
    }
  },
);

export const handlePreviousPeriodCheckBoxChange = R.curry(
  (form: FormSetFieldValue, event: React.ChangeEvent<HTMLInputElement>) => {
    const isChecked = event.currentTarget.checked;
    form.setFieldValue('previousPeriod', isChecked);

    if (!isChecked) {
      form.setFieldValue('previousPeriodAmountChange', isChecked);
      form.setFieldValue('previousPeriodPercentageChange', isChecked);
    }
  },
);

export const handlePreviousYearChangeCheckboxChange = R.curry(
  (form: FormSetFieldValue, event: React.ChangeEvent<HTMLInputElement>) => {
    const isChecked = event.currentTarget.checked;

    if (isChecked) {
      form.setFieldValue('previousYear', event.currentTarget.checked);
    }
    form.setFieldValue('previousYearAmountChange', event.currentTarget.checked);
  },
);

export const handlePreviousYearPercentageCheckboxChange = R.curry(
  (form: FormSetFieldValue, event: React.ChangeEvent<HTMLInputElement>) => {
    const isChecked = event.currentTarget.checked;

    if (isChecked) {
      form.setFieldValue('previousYear', event.currentTarget.checked);
    }
    form.setFieldValue('previousYearPercentageChange', isChecked);
  },
);

export const handlePreivousPeriodPercentageCheckboxChange = R.curry(
  (form: FormSetFieldValue, event: React.ChangeEvent<HTMLInputElement>) => {
    const isChecked = event.currentTarget.checked;

    if (isChecked) {
      form.setFieldValue('previousPeriod', isChecked);
    }
    form.setFieldValue('previousPeriodPercentageChange', isChecked);
  },
);

export const handlePreviousPeriodChangeCheckboxChange = R.curry(
  (form: FormSetFieldValue, event: React.ChangeEvent<HTMLInputElement>) => {
    const isChecked = event.currentTarget.checked;

    if (isChecked) {
      form.setFieldValue('previousPeriod', isChecked);
    }
    form.setFieldValue('previousPeriodAmountChange', isChecked);
  },
);
