// @ts-nocheck
import React from 'react';
import clsx from 'classnames';
import { CLASSES } from '@/constants/classes';
import styles from '@/style/components/BigAmount.module.scss';

interface PageFormBigNumberProps {
  label: string;
  amount: string | number;
}
export function PageFormBigNumber({ label, amount }: PageFormBigNumberProps) {
  return (
    <div className={clsx(CLASSES.PAGE_FORM_HEADER_BIG_NUMBERS)}>
      <div className={clsx(styles.root)}>
        <span className={clsx(styles.label)}>{label}</span>
        <h1 className={clsx(styles.number)}>{amount}</h1>
      </div>
    </div>
  );
}
