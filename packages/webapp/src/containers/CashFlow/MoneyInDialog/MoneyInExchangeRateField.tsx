import { useFormikContext } from 'formik';
import React from 'react';
import { useMoneyInFieldsContext } from './MoneyInFieldsProvider';
import { useForeignAccount } from './utils';
import type { MoneyInFormValues } from './types';
import type { Account } from '@bigcapital/sdk-ts';
import { ExchangeRateMutedField } from '@/components';

export function MoneyInExchangeRateField() {
  const { account } = useMoneyInFieldsContext();
  const { values } = useFormikContext<MoneyInFormValues>();

  const isForeigAccount = useForeignAccount();

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
