import classnames from 'classnames';
import React, { ReactNode, CSSProperties } from 'react';
import { LoadingIndicator } from '../Indicator';

interface DashboardInsiderProps {
  loading?: boolean;
  children: ReactNode;
  name?: string;
  mount?: boolean;
  className?: string;
  style?: CSSProperties;
}

export function DashboardInsider({
  loading,
  children,
  name,
  mount = false,
  className,
  style,
}: DashboardInsiderProps) {
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
