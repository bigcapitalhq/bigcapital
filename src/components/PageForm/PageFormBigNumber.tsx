// @ts-nocheck
import React from 'react';
import classNames from 'classnames';
import { CLASSES } from '@/constants/classes';
import { Money } from '@/components';

import '@/style/components/BigAmount.scss';

export function PageFormBigNumber({ label, amount, currencyCode }) {
  return (
    <div className={classNames(CLASSES.PAGE_FORM_HEADER_BIG_NUMBERS)}>
      <div class="big-amount">
        <span class="big-amount__label">{label}</span>
        <h1 class="big-amount__number">
          <Money amount={amount} currency={currencyCode} />
        </h1>
      </div>
    </div>
  );
}
