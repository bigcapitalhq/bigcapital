import React from 'react';
import { formattedExchangeRate } from '@/utils';
export default function MoneyExchangeRate({ amount, currency }) {
  return <span>{formattedExchangeRate(amount, currency)}</span>;
}
