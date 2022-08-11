import React from 'react';
import intl from 'react-intl-universal';
import { Button } from '@blueprintjs/core';
import { useFormikContext } from 'formik';
import { ExchangeRateInputGroup } from '@/components';
import { useCurrentOrganization } from '@/hooks/state';
import { useEstimateIsForeignCustomer } from './utils';


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
