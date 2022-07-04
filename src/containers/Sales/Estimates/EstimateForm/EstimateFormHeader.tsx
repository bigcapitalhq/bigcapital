import React, { useMemo } from 'react';
import classNames from 'classnames';
import { useFormikContext } from 'formik';
import intl from 'react-intl-universal';

import { CLASSES } from 'common/classes';
import EstimateFormHeaderFields from './EstimateFormHeaderFields';

import { getEntriesTotal } from 'containers/Entries/utils';
import { PageFormBigNumber } from '@/components';

// Estimate form top header.
function EstimateFormHeader() {
  const {
    values: { entries, currency_code },
  } = useFormikContext();


  // Calculate the total due amount of bill entries.
  const totalDueAmount = useMemo(
    () => getEntriesTotal(entries),
    [entries],
  );

  return (
    <div className={classNames(CLASSES.PAGE_FORM_HEADER)}>
      <EstimateFormHeaderFields />

      <PageFormBigNumber
        label={intl.get('amount')}
        amount={totalDueAmount}
        currencyCode={currency_code}
      />
    </div>
  );
}

export default EstimateFormHeader;
