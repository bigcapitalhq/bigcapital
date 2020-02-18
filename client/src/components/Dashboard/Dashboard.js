import React from 'react';
import Sidebar from 'components/Sidebar/Sidebar';
import DashboardContent from 'components/Dashboard/DashboardContent';

export default function() {
  return ( 
    <div className="dashboard" id="dashboard">
      <Sidebar />
      <DashboardContent />
    </div>
  )
}