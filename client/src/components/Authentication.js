import React from 'react';
import { Redirect, Route, Switch, Link, useLocation } from 'react-router-dom';
import BodyClassName from 'react-body-classname';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import authenticationRoutes from 'routes/authentication';
import { FormattedMessage as T } from 'components';
import Icon from 'components/Icon';
import { useIsAuthenticated } from 'hooks/state';
import {AuthenticationBoot} from '../containers/Authentication/AuthenticationBoot';
import 'style/pages/Authentication/Auth.scss';

function PageFade(props) {
  return <CSSTransition {...props} classNames="authTransition" timeout={500} />;
}

export default function AuthenticationWrapper({ ...rest }) {
  const to = { pathname: '/' };
  const location = useLocation();
  const isAuthenticated = useIsAuthenticated();
  const locationKey = location.pathname;

  return (
    <>
      {isAuthenticated ? (
        <Redirect to={to} />
      ) : (
        <BodyClassName className={'authentication'}>
          <div class="authentication-page">
          <AuthenticationBoot />
            <a
              href={'http://bigcapital.ly'}
              className={'authentication-page__goto-bigcapital'}
            >
              <T id={'go_to_bigcapital_com'} />
            </a>

            <div class="authentication-page__form-wrapper">
              <div class="authentication-insider">
                <div className={'authentication-insider__logo-section'}>
                  <Icon icon="bigcapital" height={37} width={214} />
                </div>

                <TransitionGroup>
                  <PageFade key={locationKey}>
                    <Switch>
                      {authenticationRoutes.map((route, index) => (
                        <Route
                          key={index}
                          path={route.path}
                          exact={route.exact}
                          component={route.component}
                        />
                      ))}
                    </Switch>
                  </PageFade>
                </TransitionGroup>
              </div>
            </div>
          </div>
        </BodyClassName>
      )}
    </>
  );
}
