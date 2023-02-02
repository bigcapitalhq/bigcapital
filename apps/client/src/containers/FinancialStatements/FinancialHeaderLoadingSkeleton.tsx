// @ts-nocheck
import React from 'react';
import { Classes } from '@blueprintjs/core';
import clsx from 'classnames';
import Style from './FinancialHeaderLoadingSkeleton.module.scss';

function FinancialHeaderLoadingSkeletonLine() {
  return (
    <div className={clsx(Style.line)}>
      <h4 className={clsx(Classes.SKELETON, Style.line_label)}>XXXXXXXX</h4>
      <h4 className={clsx(Classes.SKELETON, Style.line_field)}>XXXXXXXX</h4>
    </div>
  );
}

/**
 * Financial drawer header loading skeleton.
 */
export function FinancialHeaderLoadingSkeleton() {
  return (
    <div className={clsx(Style.lines)}>
      <FinancialHeaderLoadingSkeletonLine />
      <FinancialHeaderLoadingSkeletonLine />
      <FinancialHeaderLoadingSkeletonLine />
    </div>
  );
}
