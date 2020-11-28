import React from 'react';
import classNames from 'classnames';
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
  return (
    <div className={classNames(CLASSES.PAGE_FORM_HEADER)}>
      <InvoiceFormHeaderFields
        onInvoiceNumberChanged={onInvoiceNumberChanged}
      />

      <PageFormBigNumber
        label={'Due Amount'}
        amount={0}
        currencyCode={'LYD'}
      />
    </div>
  );
}