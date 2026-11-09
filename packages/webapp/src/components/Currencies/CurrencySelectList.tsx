// @ts-nocheck
import React from 'react';
import { FSelect } from '../Forms';
import { FormattedMessage as T } from '@/components';

/**
 * Currency select field.
 * @returns {React.ReactNode}
 */
export function CurrencySelectList({
  // #ownProps
  items,
  name,
  placeholder = <T id={'select_currency_code'} />,
  ...props
}) {
  return (
    <FSelect
      name={name}
      items={items}
      textAccessor={'currencyCode'}
      valueAccessor={'currencyCode'}
      placeholder={placeholder}
      popoverProps={{ minimal: true, usePortal: true, inline: false }}
      {...props}
    />
  );
}
