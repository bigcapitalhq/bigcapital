// @ts-nocheck
import React from 'react';
import classNames from 'classnames';
import { CLASSES } from '@/constants/classes';

import '@/style/components/BigAmount.scss';

interface PageFormBigNumberProps {
  label: string;
  amount: string | number;
}
export function PageFormBigNumber({
  label,
  amount,
}: PageFormBigNumberProps) {
  return (
    <div className={classNames(CLASSES.PAGE_FORM_HEADER_BIG_NUMBERS)}>
      <div class="big-amount">
        <span class="big-amount__label">{label}</span>
        <h1 class="big-amount__number">{amount}</h1>
      </div>
    </div>
  );
}
