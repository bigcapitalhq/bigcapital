// @ts-nocheck
import React from 'react';
import { Classes } from '@blueprintjs/core';
import { LoadingIndicator } from '../Indicator';

export function DrawerLoading({ loading, mount = false, children }) {
  return (
    <LoadingIndicator loading={loading} mount={mount}>
      {children}
    </LoadingIndicator>
  );
}

export function DrawerBody({ children }) {
  return <div className={Classes.DRAWER_BODY}>{children}</div>;
}

export * from './DrawerActionsBar';
