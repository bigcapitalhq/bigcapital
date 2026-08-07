import { Button } from '@blueprintjs/core';
import { useFormikContext } from 'formik';
import React from 'react';
import intl from 'react-intl-universal';
import { useBillIsForeignCustomer, type BillFormValues } from './utils';
import { ExchangeRateInputGroup } from '@/components';
import { useCurrentOrganizationBaseCurrency } from '@/hooks/query';

type BillExchangeRateInputFieldProps = Omit<
  React.ComponentProps<typeof ExchangeRateInputGroup>,
  'fromCurrency' | 'toCurrency' | 'name' | 'onCancel' | 'onRecalcConfirm'
>;

/**
 * bill exchange rate input field.
 * @returns {JSX.Element}
 */
export function BillExchangeRateInputField({
  ...props
}: BillExchangeRateInputFieldProps) {
  const baseCurrency = useCurrentOrganizationBaseCurrency();
  const { values } = useFormikContext<BillFormValues>();

  const isForeignCustomer = useBillIsForeignCustomer();

  // Can't continue if the customer is not foreign.
  if (!isForeignCustomer) {
    return null;
  }
  return (
    <ExchangeRateInputGroup
      name={'exchangeRate'}
      fromCurrency={values.currencyCode}
      toCurrency={baseCurrency ?? ''}
      {...props}
    />
  );
}

/**
 * bill project select.
 * @returns {JSX.Element}
 */
export function BillProjectSelectButton({ label }: { label?: string }) {
  return <Button text={label ?? intl.get('select_project')} />;
}
