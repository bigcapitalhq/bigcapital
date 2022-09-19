// @ts-nocheck
import React from 'react';
import { formattedAmount } from '@/utils';

export function Money({ amount, currency }) {
  return (
    <span>{ formattedAmount(amount, currency) }</span>
  );
}