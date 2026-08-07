import React from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import DashboardErrorBoundary from './DashboardErrorBoundary';
import DashboardContentRoutes from '@/components/Dashboard/DashboardContentRoute';
import DashboardTopbar from '@/components/Dashboard/DashboardTopbar';

const DashboardContent = React.forwardRef<HTMLDivElement, {}>(({}, ref) => {
  return (
    <ErrorBoundary FallbackComponent={DashboardErrorBoundary}>
      <div className="dashboard-content" id="dashboard" ref={ref}>
        <DashboardTopbar />
        <DashboardContentRoutes />
      </div>
    </ErrorBoundary>
  );
});

export default DashboardContent;
