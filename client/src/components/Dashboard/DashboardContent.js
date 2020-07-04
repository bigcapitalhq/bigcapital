import React from 'react';
import DashboardTopbar from 'components/Dashboard/DashboardTopbar';
import DashboardContentRoute from 'components/Dashboard/DashboardContentRoute';
import DashboardFooter from 'components/Dashboard/DashboardFooter';

export default function() {
  return (
    <div className="dashboard-content" id="dashboard">
      <DashboardTopbar />
      <DashboardContentRoute />

      <DashboardFooter />
    </div>
  );
}