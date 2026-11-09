import { useFormikContext } from 'formik';
import React from 'react';
import { useMoneyOutFieldsContext } from './MoneyOutFieldsProvider';
import { useForeignAccount } from './utils';
import type { MoneyOutFormValues } from './types';
import type { Account } from '@bigcapital/sdk-ts';
import { ExchangeRateMutedField } from '@/components';

/**
 * Money-out exchange rate field.
 */
export function MoneyOutExchangeRateField() {
  const { values } = useFormikContext<MoneyOutFormValues>();

  const { account } = useMoneyOutFieldsContext();
  const isForeigAccount = useForeignAccount();

  // Cannot continue if the account is not foreign account.
  if (!isForeigAccount) return null;

  return (
    <ExchangeRateMutedField
      name={'exchangeRate'}
      fromCurrency={values.currencyCode}
      toCurrency={(account as Account | undefined)?.currencyCode}
      formGroupProps={{ label: '', inline: false }}
      date={values.date}
      exchangeRate={values.exchangeRate}
    />
  );
}
