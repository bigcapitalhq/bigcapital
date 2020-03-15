import React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import authenticationRoutes from 'routes/authentication';

export default function({ isAuthenticated =false, ...rest }) {
  const to = {pathname: '/dashboard/homepage'};

  return (
    <Route path="/auth">
      { (isAuthenticated) ?
        (<Redirect to={to} />) : (
        <Switch>
          <div class="authentication-page">
            <div class="authentication-page__form-wrapper">
              { authenticationRoutes.map((route, index) => (
                <Route
                  key={index}
                  path={route.path}
                  exact={route.exact}
                  component={route.component}
                />
              ))}
            </div>
          </div>
        </Switch>)
      }
    </Route>
  );
}