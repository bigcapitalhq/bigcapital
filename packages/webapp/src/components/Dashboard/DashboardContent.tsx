// @ts-nocheck
import React from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import DashboardTopbar from '@/components/Dashboard/DashboardTopbar';
import DashboardContentRoutes from '@/components/Dashboard/DashboardContentRoute';
import DashboardErrorBoundary from './DashboardErrorBoundary';

export default React.forwardRef(({}, ref) => {
  return (
    <ErrorBoundary FallbackComponent={DashboardErrorBoundary}>
      <div className="dashboard-content" id="dashboard" ref={ref}>
        <DashboardTopbar />
        <DashboardContentRoutes />
      </div>
    </ErrorBoundary>
  );
});
