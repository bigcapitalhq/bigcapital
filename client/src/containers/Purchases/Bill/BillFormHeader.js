import React from 'react';
import classNames from 'classnames';

import { CLASSES } from 'common/classes';

import BillFormHeaderFields from './BillFormHeaderFields';
import { PageFormBigNumber } from 'components';

/**
 * Fill form header.
 */
export default function BillFormHeader({ onBillNumberChanged }) {
  return (
    <div className={classNames(CLASSES.PAGE_FORM_HEADER)}>
      <BillFormHeaderFields onBillNumberChanged={onBillNumberChanged} />

      <PageFormBigNumber label={'Due Amount'} amount={0} currencyCode={'LYD'} />
    </div>
  );
}
