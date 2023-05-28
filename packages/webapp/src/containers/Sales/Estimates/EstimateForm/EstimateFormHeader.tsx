// @ts-nocheck
import React, { useMemo } from 'react';
import intl from 'react-intl-universal';
import classNames from 'classnames';
import { useFormikContext } from 'formik';
import { CLASSES } from '@/constants/classes';

import EstimateFormHeaderFields from './EstimateFormHeaderFields';

import { getEntriesTotal } from '@/containers/Entries/utils';
import { PageFormBigNumber } from '@/components';

// Estimate form top header.
function EstimateFormHeader() {
  return (
    <div className={classNames(CLASSES.PAGE_FORM_HEADER)}>
      <EstimateFormHeaderFields />
      <EstimateFormBigTotal />
    </div>
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
