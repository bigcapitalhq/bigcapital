// @ts-nocheck
import React, { useEffect } from 'react';
import intl from 'react-intl-universal';
import { Button } from '@blueprintjs/core';
import * as R from 'ramda';
import { useFormikContext } from 'formik';
import { ExchangeRateInputGroup } from '@/components';
import { useCurrentOrganization } from '@/hooks/state';
import { useEstimateIsForeignCustomer } from './utils';
import withSettings from '@/containers/Settings/withSettings';
import { transactionNumber } from '@/utils';
import { useUpdateEffect } from '@/hooks';

/**
 * Estimate exchange rate input field.
 * @returns {JSX.Element}
 */
export function EstimateExchangeRateInputField({ ...props }) {
  const currentOrganization = useCurrentOrganization();
  const { values } = useFormikContext();

  const isForeignCustomer = useEstimateIsForeignCustomer();

  // Can't continue if the customer is not foreign.
  if (!isForeignCustomer) {
    return null;
  }
  return (
    <ExchangeRateInputGroup
      fromCurrency={values.currency_code}
      toCurrency={currentOrganization.base_currency}
      {...props}
    />
  );
}

/**
 * Estimate project select.
 * @returns {JSX.Element}
 */
export function EstimateProjectSelectButton({ label }) {
  return <Button text={label ?? intl.get('select_project')} />;
}

/**
 * Syncs the estimate auto-increment settings to estimate form.
 * @returns {React.ReactNode}
 */
export const EstimateIncrementSyncSettingsToForm = R.compose(
  withSettings(({ estimatesSettings }) => ({
    estimateNextNumber: estimatesSettings?.nextNumber,
    estimateNumberPrefix: estimatesSettings?.numberPrefix,
    estimateAutoIncrement: estimatesSettings?.autoIncrement,
  })),
)(({ estimateNextNumber, estimateNumberPrefix, estimateAutoIncrement }) => {
  const { setFieldValue } = useFormikContext();

  useUpdateEffect(() => {
    if (!estimateAutoIncrement) return null;

    const estimateNo = transactionNumber(
      estimateNumberPrefix,
      estimateNextNumber,
    );
    setFieldValue('estimate_number', estimateNo);
  }, [
    setFieldValue,
    estimateNumberPrefix,
    estimateNextNumber,
    estimateAutoIncrement,
  ]);

  return null;
});
