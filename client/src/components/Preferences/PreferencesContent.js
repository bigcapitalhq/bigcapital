import React from 'react';
import PreferencesTopbar from 'components/Preferences/PreferencesTopbar';
import PreferencesContentRoute from 'components/Preferences/PreferencesContentRoute';

export default function() {
  return (
    <div className="dashboard-content dashboard-content--preferences">
      <PreferencesTopbar pageTitle={"asdad"}/>
      
      <div class="dashboard__preferences-content">
        <PreferencesContentRoute />
      </div>
    </div>
  )
}