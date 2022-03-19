import React from 'react';

export const FlagIcon = ({ currencyCode, className }) => {
  const source = `/icons/flags/${currencyCode}.svg`;

  return <img alt="flag" src={source} className={className} />;
};
