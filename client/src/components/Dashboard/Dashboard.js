import React from 'react';
import {Route} from 'react-router-dom';
import Sidebar from 'components/Sidebar/Sidebar';
import DashboardContent from 'components/Dashboard/DashboardContent';

export default function() {
  return ( 
    <div className="dashboard" id="dashboard">
      <Route pathname="/dashboard/">
        <Sidebar />
        <DashboardContent />
      </Route>
    </div>
  )
}