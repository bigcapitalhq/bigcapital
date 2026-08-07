import { Spinner } from '@blueprintjs/core';
import { Suspense } from 'react';
import BodyClassName from 'react-body-classname';
import { Route, Switch, useLocation } from 'react-router-dom';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import styled from 'styled-components';
import { AuthMetaBootProvider } from './AuthMetaBoot';
import { Box, Icon } from '@/components';
import { BigcapitalAlt } from '@/components/Icons/BigcapitalAlt';
import { useIsDarkMode } from '@/hooks/useDarkMode';
import authenticationRoutes from '@/routes/authentication';

import '@/style/pages/Authentication/Auth.scss';

export function Authentication() {
  const isDarkMode = useIsDarkMode();

  return (
    <BodyClassName className={'authentication'}>
      <AuthPage>
        <AuthInsider>
          <AuthLogo>
            {isDarkMode ? (
              <BigcapitalAlt
                color={'rgba(255, 255, 255, 0.6)'}
                height={37}
                width={214}
              />
            ) : (
              <Icon icon="bigcapital" height={37} width={214} />
            )}
          </AuthLogo>

          <AuthMetaBootProvider>
            <Suspense
              fallback={
                <Box style={{ marginTop: '5rem' }}>
                  <Spinner size={30} />
                </Box>
              }
            >
              <AuthenticationRoutes />
            </Suspense>
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
            <Route key={index} path={route.path} component={route.component} />
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
