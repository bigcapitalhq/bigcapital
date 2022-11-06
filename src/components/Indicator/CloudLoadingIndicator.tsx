// @ts-nocheck
import React from 'react';
import classNames from 'classnames';
import { Spinner } from '@blueprintjs/core';
import { CLASSES } from '@/constants/classes';
import { If } from '../Utils/If';

export function CloudLoadingIndicator({ isLoading, children }) {
  return (
    <div
      className={classNames(CLASSES.CLOUD_SPINNER, {
        [CLASSES.IS_LOADING]: isLoading,
      })}
    >
      <If condition={isLoading}>
        <Spinner size={30} value={null} />
      </If>
      {children}
    </div>
  );
}
