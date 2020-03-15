import React from 'react';
import classnames from 'classnames';
import LoadingIndicator from 'components/LoadingIndicator';

export default function DashboardInsider({ loading, children, name }) {
  return (
    <div className={classnames({
      'dashboard__insider': true,
      'dashboard__insider--loading': loading,
      [`dashboard__insider--${name}`]: !!name,
    })}>
      <LoadingIndicator loading={loading}>
        { children }
      </LoadingIndicator>
    </div>
  );
}