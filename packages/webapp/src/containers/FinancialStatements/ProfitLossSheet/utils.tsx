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

export const getDefaultProfitLossQuery = () => ({
  basis: 'cash',
  fromDate: moment().startOf('year').format('YYYY-MM-DD'),
  toDate: moment().format('YYYY-MM-DD'),
  displayColumnsType: 'total',
  filterByOption: 'with-transactions',

  previousYear: false,
  previousYearAmountChange: false,
  previousYearPercentageChange: false,

  previousPeriod: false,
  previousPeriodAmountChange: false,
  previousPeriodPercentageChange: false,

  percentageColumn: false,
  percentageRow: false,
  percentageIncome: false,
  percentageExpense: false,

  branchesIds: [],
  numberFormat: {},
});

const parseProfitLossQuery = (locationQuery: Record<string, unknown>) => {
  const defaultQuery = getDefaultProfitLossQuery();

  const transformed = {
    ...defaultQuery,
    ...transformToForm(locationQuery, defaultQuery),
  };

  return {
    ...transformed,
    branchesIds: castArray(transformed.branchesIds),
  };
};

export const useProfitLossSheetQuery = () => {
  const [locationQuery, setLocationQuery] = useAppQueryString();

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
      form.setFieldValue('previousYear', isChecked);
    }
    form.setFieldValue('previousYearAmountChange', isChecked);
  },
);

export const handlePreviousYearPercentageCheckboxChange = R.curry(
  (form: FormSetFieldValue, event: React.ChangeEvent<HTMLInputElement>) => {
    const isChecked = event.currentTarget.checked;
    if (isChecked) {
      form.setFieldValue('previousYear', isChecked);
    }
    form.setFieldValue('previousYearPercentageChange', isChecked);
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

export const handlePreviousPeriodPercentageCheckboxChange = R.curry(
  (form: FormSetFieldValue, event: React.ChangeEvent<HTMLInputElement>) => {
    const isChecked = event.currentTarget.checked;
    if (isChecked) {
      form.setFieldValue('previousPeriod', isChecked);
    }
    form.setFieldValue('previousPeriodPercentageChange', isChecked);
  },
);
