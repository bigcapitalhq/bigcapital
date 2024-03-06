// @ts-nocheck
import React from 'react';
import clsx from 'classnames';
import { Classes } from '@blueprintjs/core';
import { LoadingIndicator } from '../Indicator';

export function DrawerLoading({ loading, mount = false, children }) {
  return (
    <LoadingIndicator loading={loading} mount={mount}>
      {children}
    </LoadingIndicator>
  );
}

export function DrawerBody({ children, className }) {
  return <div className={clsx(Classes.DRAWER_BODY, className)}>{children}</div>;
}

export * from './DrawerActionsBar';
