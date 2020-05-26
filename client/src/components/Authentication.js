import React from 'react';
import { Redirect, Route, Switch, Link } from 'react-router-dom';
import BodyClassName from 'react-body-classname';
import authenticationRoutes from 'routes/authentication';
import { FormattedMessage as T } from 'react-intl';
import withAuthentication from 'containers/Authentication/withAuthentication';
import { compose } from 'utils';


function AuthenticationWrapper({ isAuthorized = false, ...rest }) {
  const to = { pathname: '/homepage' };

  return (
    <>
      {isAuthorized ? (
        <Redirect to={to} />
      ) : (
        <BodyClassName className={'authentication'}>
          <Switch>
            <div class="authentication-page">
              <Link
                to={'bigcapital.io'}
                className={'authentication-page__goto-bigcapital'}
              >
                <T id={'go_to_bigcapital_com'} />
              </Link>

              <div class="authentication-page__form-wrapper">
                {authenticationRoutes.map((route, index) => (
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
      )}
    </>
  );
}

export default compose(withAuthentication)(AuthenticationWrapper);
