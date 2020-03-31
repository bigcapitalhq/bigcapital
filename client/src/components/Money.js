import React from 'react';
import Currency from 'js-money/lib/currency';
import accounting from 'accounting';

function formattedAmount(cents, currency) {
  const { symbol, decimal_digits: precision } = Currency[currency];
  const amount = cents / Math.pow(10, precision);

  return accounting.formatMoney(amount, { symbol, precision });
}

export default function Money({ amount, currency }) {
  return (
    <span>{ formattedAmount(amount, currency) }</span>
  );
}