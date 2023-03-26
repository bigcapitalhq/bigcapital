// @ts-nocheck
import React from 'react';
import intl from 'react-intl-universal';
import { Button } from '@blueprintjs/core';
import { useFormikContext } from 'formik';
import { ExchangeRateInputGroup } from '@/components';
import { useCurrentOrganization } from '@/hooks/state';
import { useReceiptIsForeignCustomer } from './utils';

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
