// @ts-nocheck
import React from 'react';

export const FlagIcon = ({ currencyCode, className }) => {
  const source = `/icons/currency-flags/${currencyCode}.svg`;

  return <img alt="flag" src={source} className={className} />;
};
