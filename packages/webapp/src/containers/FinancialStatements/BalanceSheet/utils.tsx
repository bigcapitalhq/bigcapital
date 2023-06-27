// @ts-nocheck
import React from 'react';
import * as R from 'ramda';
import moment from 'moment';
import * as Yup from 'yup';
import { castArray } from 'lodash';
import intl from 'react-intl-universal';

import { transformToForm } from '@/utils';
import { useAppQueryString } from '@/hooks';

/**
 * Retrieves the default balance sheet query.
 * @returns {}
 */
export const getDefaultBalanceSheetQuery = () => ({
  fromDate: moment().startOf('year').format('YYYY-MM-DD'),
  toDate: moment().endOf('year').format('YYYY-MM-DD'),
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

/**
 * Parses balance sheet query.
 */
const parseBalanceSheetQuery = (locationQuery) => {
  const defaultQuery = getDefaultBalanceSheetQuery();

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

/**
 * Handles previous year checkbox change.
 */
export const handlePreviousYearCheckBoxChange = R.curry((form, event) => {
  const isChecked = event.currentTarget.checked;
  form.setFieldValue('previousYear', isChecked);

  if (!isChecked) {
    form.setFieldValue('previousYearAmountChange', isChecked);
    form.setFieldValue('previousYearPercentageChange', isChecked);
  }
});

/**
 * Handles previous period checkbox change.
 */
export const handlePreviousPeriodCheckBoxChange = R.curry((form, event) => {
  const isChecked = event.currentTarget.checked;
  form.setFieldValue('previousPeriod', isChecked);

  if (!isChecked) {
    form.setFieldValue('previousPeriodAmountChange', isChecked);
    form.setFieldValue('previousPeriodPercentageChange', isChecked);
  }
});

/**
 * Handles previous year change checkbox change.
 */
export const handlePreviousYearChangeCheckboxChange = R.curry((form, event) => {
  const isChecked = event.currentTarget.checked;

  if (isChecked) {
    form.setFieldValue('previousYear', event.currentTarget.checked);
  }
  form.setFieldValue('previousYearAmountChange', event.currentTarget.checked);
});

/**
 * Handles previous year percentage checkbox change.
 */
export const handlePreviousYearPercentageCheckboxChange = R.curry(
  (form, event) => {
    const isChecked = event.currentTarget.checked;

    if (isChecked) {
      form.setFieldValue('previousYear', event.currentTarget.checked);
    }
    form.setFieldValue('previousYearPercentageChange', isChecked);
  },
);

/**
 * Handles previous period percentage checkbox change.
 */
export const handlePreviousPeriodPercentageCheckboxChange = R.curry(
  (form, event) => {
    const isChecked = event.currentTarget.checked;

    if (isChecked) {
      form.setFieldValue('previousPeriod', isChecked);
    }
    form.setFieldValue('previousPeriodPercentageChange', isChecked);
  },
);

/**
 * Handle previous period change checkbox change.
 */
export const handlePreviousPeriodChangeCheckboxChange = R.curry(
  (form, event) => {
    const isChecked = event.currentTarget.checked;

    if (isChecked) {
      form.setFieldValue('previousPeriod', isChecked);
    }
    form.setFieldValue('previousPeriodAmountChange', isChecked);
  },
);
