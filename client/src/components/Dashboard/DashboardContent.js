import React from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import DashboardTopbar from 'components/Dashboard/DashboardTopbar';
import DashboardContentRoute from 'components/Dashboard/DashboardContentRoute';
import DashboardFooter from 'components/Dashboard/DashboardFooter';
import DashboardErrorBoundary from './DashboardErrorBoundary';

export default function () {
  return (
    <ErrorBoundary FallbackComponent={DashboardErrorBoundary}>
      <div className="dashboard-content" id="dashboard">
        <DashboardTopbar />
        <DashboardContentRoute />
        <DashboardFooter />
      </div>
    </ErrorBoundary>
  );
}
