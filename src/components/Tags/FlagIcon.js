import React from 'react';

export const FlagIcon = ({ countryCode, className }) => {
  const source = `/icons/flags/${countryCode}.svg`;

  return <img alt="flag" src={source} className={className} />;
};
