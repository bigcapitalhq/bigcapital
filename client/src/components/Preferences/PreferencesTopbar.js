import React from 'react';
import DashboardTopbarUser from 'components/Dashboard/TopbarUser';

export default function PreferencesTopbar() {
  return (
    <div class="dashboard__preferences-topbar">
      <h2>Accounts</h2>

      <div class="dashboard__topbar-user">
        <DashboardTopbarUser />
      </div>
    </div>
  );
}