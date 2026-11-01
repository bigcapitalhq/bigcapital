// @ts-nocheck
import { Spinner } from '@blueprintjs/core';
import classNames from 'classnames';
import React from 'react';
import { If } from '../Utils/If';
import { CLASSES } from '@/constants/classes';

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
