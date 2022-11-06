// @ts-nocheck
import React from 'react';
import classnames from 'classnames';
import { LoadingIndicator } from '../Indicator';

export function DashboardInsider({
  loading,
  children,
  name,
  mount = false,
  className,
}) {
  return (
    <div
      className={classnames(
        {
          dashboard__insider: true,
          'dashboard__insider--loading': loading,
          [`dashboard__insider--${name}`]: !!name,
        },
        className,
      )}
    >
      <LoadingIndicator loading={loading} mount={mount}>
        {children}
      </LoadingIndicator>
    </div>
  );
}
