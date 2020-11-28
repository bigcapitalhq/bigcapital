import React from 'react';
import { formattedAmount } from 'utils';

export default function Money({ amount, currency }) {
  return (
    <span>{ formattedAmount(amount, currency) }</span>
  );
}