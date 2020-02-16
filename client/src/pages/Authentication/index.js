import React from 'react';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import authenticationRoutes from 'routes/authentication';

export default function() {
  return (
    <div class="authentication-page">
      <Router>
        <Link to="/login">{ "Login" }</Link>
        <Link to="/reset_password">{ "Reset Password" }</Link>

        <Switch>
          { authenticationRoutes.map((route, index) => (
            <Route
              key={index}
              path={route.path}
              exact={route.exact}
              component={route.component}
            />
          ))}
        </Switch>
      </Router>
    </div>
  );
}