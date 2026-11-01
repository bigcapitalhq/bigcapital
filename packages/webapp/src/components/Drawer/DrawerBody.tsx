import { Classes } from '@blueprintjs/core';
import clsx from 'classnames';
import React from 'react';
import { LoadingIndicator } from '../Indicator';

interface DrawerLoadingProps {
  loading?: boolean;
  mount?: boolean;
  children?: React.ReactNode;
}

export function DrawerLoading({
  loading,
  mount = false,
  children,
}: DrawerLoadingProps) {
  return (
    <LoadingIndicator loading={loading} mount={mount}>
      {children}
    </LoadingIndicator>
  );
}

interface DrawerBodyProps {
  children?: React.ReactNode;
  className?: string;
}

export function DrawerBody({ children, className }: DrawerBodyProps) {
  return <div className={clsx(Classes.DRAWER_BODY, className)}>{children}</div>;
}

export * from './DrawerActionsBar';
