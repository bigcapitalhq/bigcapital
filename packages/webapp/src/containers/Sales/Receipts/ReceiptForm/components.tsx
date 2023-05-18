// @ts-nocheck
import React from 'react';
import intl from 'react-intl-universal';
import { Button } from '@blueprintjs/core';
import { useFormikContext } from 'formik';
import * as R from 'ramda';

import { ExchangeRateInputGroup } from '@/components';
import { useCurrentOrganization } from '@/hooks/state';
import { useReceiptIsForeignCustomer } from './utils';
import { useUpdateEffect } from '@/hooks';
import withSettings from '@/containers/Settings/withSettings';
import { transactionNumber } from '@/utils';

/**
 * Receipt exchange rate input field.
 * @returns {JSX.Element}
 */
export function ReceiptExchangeRateInputField({ ...props }) {
  const currentOrganization = useCurrentOrganization();
  const { values } = useFormikContext();

  const isForeignCustomer = useReceiptIsForeignCustomer();

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
 * Receipt project select.
 * @returns {JSX.Element}
 */
export function ReceiptProjectSelectButton({ label }) {
  return <Button text={label ?? intl.get('select_project')} />;
}

/**
 * Syncs receipt auto-increment settings to form.
 * @return {React.ReactNode}
 */
export const ReceiptSyncIncrementSettingsToForm = R.compose(
  withSettings(({ receiptSettings }) => ({
    receiptAutoIncrement: receiptSettings?.autoIncrement,
    receiptNextNumber: receiptSettings?.nextNumber,
    receiptNumberPrefix: receiptSettings?.numberPrefix,
  })),
)(({ receiptAutoIncrement, receiptNextNumber, receiptNumberPrefix }) => {
  const { setFieldValue } = useFormikContext();

  useUpdateEffect(() => {
    if (!receiptAutoIncrement) return;

    const receiptNo = transactionNumber(receiptNumberPrefix, receiptNextNumber);
    setFieldValue('receipt_number', receiptNo);
  }, [
    setFieldValue,
    receiptNumberPrefix,
    receiptAutoIncrement,
    receiptNextNumber,
  ]);

  return null;
});
