import React from 'react';
import { useFormikContext } from 'formik';
import { ExchangeRateInputGroup } from 'components';
import { useCurrentOrganization } from 'hooks/state';
import { useBillIsForeignCustomer } from './utils';

/**
 * bill exchange rate input field.
 * @returns {JSX.Element}
 */
export function BillExchangeRateInputField({ ...props }) {
  const currentOrganization = useCurrentOrganization();
  const { values } = useFormikContext();

  const isForeignCustomer = useBillIsForeignCustomer();

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
