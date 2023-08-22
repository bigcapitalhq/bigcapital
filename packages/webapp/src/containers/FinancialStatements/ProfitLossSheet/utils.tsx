// @ts-nocheck
import React from 'react';
import moment from 'moment';
import intl from 'react-intl-universal';
import * as R from 'ramda';
import * as Yup from 'yup';

import { useAppQueryString } from '@/hooks';
import { transformToForm } from '@/utils';
import { castArray } from 'lodash';

/**
 * Retrieves the default profit/loss sheet query.
 * @returns
 */
export const getDefaultProfitLossQuery = () => ({
  basis: 'cash',
  fromDate: moment().startOf('year').format('YYYY-MM-DD'),
  toDate: moment().endOf('year').format('YYYY-MM-DD'),
  displayColumnsType: 'total',
  filterByOption: 'with-transactions',

  previousYear: false,
  previousYearAmountChange: false,
  previousYearPercentageChange: false,

  previousPeriod: false,
  previousPeriodAmountChange: false,
  previousPeriodPercentageChange: false,

  // Percentage columns.
  percentageColumn: false,
  percentageRow: false,
  percentageIncome: false,
  percentageExpense: false,

  branchesIds: [],
});

/**
 * Parses the profit/loss sheet query.
 */
const parseProfitLossQuery = (locationQuery) => {
  const defaultQuery = getDefaultProfitLossQuery();

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
 * Retrieves the balance sheet query API.
 */
export const useProfitLossSheetQuery = () => {
  // Retrieves location query.
  const [locationQuery, setLocationQuery] = useAppQueryString();

  // Merges the default query with location query.
  const query = React.useMemo(
    () => parseProfitLossQuery(locationQuery),
    [locationQuery],
  );
  return {
    query,
    locationQuery,
    setLocationQuery,
  };
};

/**
 * Retrieves the profit/loss header validation schema.
 * @returns
 */
export const useProfitLossHeaderValidationSchema = () => {
  return Yup.object().shape({
    fromDate: Yup.date().required().label(intl.get('from_date')),
    toDate: Yup.date()
      .min(Yup.ref('fromDate'))
      .required()
      .label(intl.get('to_date')),
    filterByOption: Yup.string(),
    displayColumnsType: Yup.string(),
  });
};

/**
 * Handles the previous year checkbox change.
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
 * Handles the preivous period checkbox change.
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
 * Handles previous year change amount checkbox change.
 */
export const handlePreviousYearChangeCheckboxChange = R.curry((form, event) => {
  const isChecked = event.currentTarget.checked;

  if (isChecked) {
    form.setFieldValue('previousYear', isChecked);
  }
  form.setFieldValue('previousYearAmountChange', isChecked);
});

/**
 * Handle previous year percentage checkbox change.
 */
export const handlePreviousYearPercentageCheckboxChange = R.curry(
  (form, event) => {
    const isChecked = event.currentTarget.checked;

    if (isChecked) {
      form.setFieldValue('previousYear', isChecked);
    }
    form.setFieldValue('previousYearPercentageChange', isChecked);
  },
);

/**
 * Handles previous period change amount checkbox change.
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
