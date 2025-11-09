// @ts-nocheck
import React from 'react';
import { FormattedMessage as T } from '@/components';
import { FSelect } from '../Forms';

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
      textAccessor={'currency_code'}
      valueAccessor={'id'}
      placeholder={placeholder}
      popoverProps={{ minimal: true, usePortal: true, inline: false }}
      {...props}
    />
  );
}
