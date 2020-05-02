import React from 'react';
import { Redirect, Route, Switch, Link } from 'react-router-dom';
import BodyClassName from 'react-body-classname'; 
import authenticationRoutes from 'routes/authentication';

export default function({ isAuthenticated =false, ...rest }) {
  const to = {pathname: '/dashboard/homepage'};

  return (
    <Route path="/auth">
      { (isAuthenticated) ?
        (<Redirect to={to} />) : (
        <BodyClassName className={'authentication'}>
          <Switch>
            <div class="authentication-page">
              <Link
                to={'bigcapital.io'}
                className={'authentication-page__goto-bigcapital'}>
                  ← Go to bigcapital.com
              </Link>

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
          </Switch>
        </BodyClassName>
        )
      }
    </Route>
  );
}