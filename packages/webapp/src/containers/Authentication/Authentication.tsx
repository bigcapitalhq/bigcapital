// @ts-nocheck
import React from 'react';
import { Redirect, Route, Switch, useLocation } from 'react-router-dom';
import BodyClassName from 'react-body-classname';
import styled from 'styled-components';
import { TransitionGroup, CSSTransition } from 'react-transition-group';

import authenticationRoutes from '@/routes/authentication';
import { Icon, FormattedMessage as T } from '@/components';
import { useIsAuthenticated } from '@/hooks/state';

import '@/style/pages/Authentication/Auth.scss';
import { AuthMetaBootProvider } from './AuthMetaBoot';

export function Authentication() {
  const to = { pathname: '/' };
  const isAuthenticated = useIsAuthenticated();

  if (isAuthenticated) {
    return <Redirect to={to} />;
  }
  return (
    <BodyClassName className={'authentication'}>
      <AuthPage>
        <AuthInsider>
          <AuthLogo>
            <Icon icon="bigcapital" height={37} width={214} />
          </AuthLogo>

          <AuthMetaBootProvider>
            <AuthenticationRoutes />
          </AuthMetaBootProvider>
        </AuthInsider>
      </AuthPage>
    </BodyClassName>
  );
}

function AuthenticationRoutes() {
  const location = useLocation();
  const locationKey = location.pathname;

  return (
    <TransitionGroup>
      <CSSTransition
        timeout={500}
        key={locationKey}
        classNames="authTransition"
      >
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
      </CSSTransition>
    </TransitionGroup>
  );
}

const AuthPage = styled.div``;
const AuthInsider = styled.div`
  width: 384px;
  margin: 0 auto;
  margin-bottom: 40px;
  padding-top: 80px;
`;

const AuthLogo = styled.div`
  text-align: center;
  margin-bottom: 40px;
`;
