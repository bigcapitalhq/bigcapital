// @ts-nocheck
import React from 'react';
import { formattedAmount } from '@/utils';

export function FormatNumber({ value, currency = '', noZero }) {
  return formattedAmount(value, currency, { noZero });
}

export function FormatNumberCell({ value, column: { formatNumber } }) {
  return <FormatNumber value={value} {...formatNumber} />;
}
