// @ts-nocheck
import React, { useMemo } from 'react';
import intl from 'react-intl-universal';
import { useFormikContext } from 'formik';
import { x } from '@xstyled/emotion';

import EstimateFormHeaderFields from './EstimateFormHeaderFields';
import { getEntriesTotal } from '@/containers/Entries/utils';
import { PageFormBigNumber } from '@/components';

// Estimate form top header.
function EstimateFormHeader() {
  return (
    <x.div
      display="flex"
      bg="white"
      p="25px 32px"
      borderBottom="1px solid #d2dce2"
    >
      <EstimateFormHeaderFields />
      <EstimateFormBigTotal />
    </x.div>
  );
}

/**
 * Big total of estimate form header.
 * @returns {React.ReactNode}
 */
function EstimateFormBigTotal() {
  const {
    values: { entries, currency_code },
  } = useFormikContext();

  // Calculate the total due amount of bill entries.
  const totalDueAmount = useMemo(() => getEntriesTotal(entries), [entries]);

  return (
    <PageFormBigNumber
      label={intl.get('amount')}
      amount={totalDueAmount}
      currencyCode={currency_code}
    />
  );
}

export default EstimateFormHeader;
