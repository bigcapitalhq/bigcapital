import React from 'react';
import { Route, Switch } from 'react-router-dom';
import dashboardRoutes from 'routes/dashboard'
import DashboardTopbar from 'components/Dashboard/DashboardTopbar';

export default function() {
  return (
    <div className="dashboard-content" id="dashboard">
      <DashboardTopbar pageTitle={"asdad"}/>
      
      <Route pathname="/dashboard/">
        <Switch>
          { dashboardRoutes.map((route, index) => (
            <Route
              key={index}
              path={route.path}
              exact={route.exact}
              component={route.component}
            />          
          ))}
        </Switch>
      </Route>
    </div>
  )
}