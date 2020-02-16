import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';
import DashboardContent from '../../components/DashboardContent';

export default function() {
  return (
    <div class="dashboard" id="dashboard">
      <Router>
        <Sidebar />
        <DashboardContent />
      </Router>
    </div>
  )
}