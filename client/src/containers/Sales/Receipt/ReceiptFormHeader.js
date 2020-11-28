import React from 'react';
import classNames from 'classnames';

import { Money } from 'components';
import { CLASSES } from 'common/classes';
import ReceiptFormHeaderFields from './ReceiptFormHeaderFields';

export default function ReceiptFormHeader({
  // #ownProps
  onReceiptNumberChanged,
}) {
  return (
    <div className={classNames(CLASSES.PAGE_FORM_HEADER)}>
      <ReceiptFormHeaderFields
        onReceiptNumberChanged={onReceiptNumberChanged}
      />

      <div className={classNames(CLASSES.PAGE_FORM_HEADER_BIG_NUMBERS)}>
        <div class="big-amount">
          <span class="big-amount__label">Due Amount</span>
          <h1 class="big-amount__number">
            <Money amount={0} currency={'LYD'} />
          </h1>
        </div>
      </div>
    </div>
  );
}
