// @ts-nocheck
import React from 'react';
import classnames from 'classnames';
import { LoadingIndicator } from '../Indicator';
import { css } from '@emotion/css';

export function DashboardInsider({
  loading,
  children,
  name,
  mount = false,
  className,
  style
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
      style={style}
    >
      <LoadingIndicator loading={loading} mount={mount}>
        {children}
      </LoadingIndicator>
    </div>
  );
}
