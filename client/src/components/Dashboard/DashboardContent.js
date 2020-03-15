import React from 'react';
import DashboardTopbar from 'components/Dashboard/DashboardTopbar';
import DashboardContentRoute from 'components/Dashboard/DashboardContentRoute';

export default function() {
  return (
    <div className="dashboard-content" id="dashboard">
      <DashboardTopbar />
      <DashboardContentRoute />
    </div>
  );
}