import React, { useMemo } from 'react';
import classNames from 'classnames';
import { sumBy } from 'lodash';
import { useFormikContext } from 'formik';

import { CLASSES } from 'common/classes';

import InvoiceFormHeaderFields from './InvoiceFormHeaderFields';
import { PageFormBigNumber } from 'components';

/**
 * Invoice form header section.
 */
export default function InvoiceFormHeader({
  // #ownProps
  onInvoiceNumberChanged,
}) {
  const { values } = useFormikContext();

  // Calculate the total due amount of invoice entries.
  const totalDueAmount = useMemo(() => sumBy(values.entries, 'total'), [
    values.entries,
  ]);

  return (
    <div className={classNames(CLASSES.PAGE_FORM_HEADER)}>
      <InvoiceFormHeaderFields
        onInvoiceNumberChanged={onInvoiceNumberChanged}
      />
      <PageFormBigNumber
        label={'Due Amount'}
        amount={totalDueAmount}
        currencyCode={'LYD'}
      />
    </div>
  );
}
