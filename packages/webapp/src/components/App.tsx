// @ts-nocheck
import { Router, Switch, Route } from 'react-router';
import { CompactRoute } from 'react-router-dom-v5-compat';
import { createBrowserHistory } from 'history';
import { QueryClientProvider, QueryClient } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';

import '@/style/App.scss';
import 'moment/locale/ar-ly';
import 'moment/locale/es-us';

import AppIntlLoader from './AppIntlLoader';
import { EnsureAuthenticated } from '@/components/Guards/EnsureAuthenticated';
import GlobalErrors from '@/containers/GlobalErrors/GlobalErrors';
import DashboardPrivatePages from '@/components/Dashboard/PrivatePages';
import { Authentication } from '@/containers/Authentication/Authentication';

import LazyLoader from '@/components/LazyLoader';
import { SplashScreen, DashboardThemeProvider } from '../components';
import { queryConfig } from '../hooks/query/base';
import { EnsureUserEmailVerified } from './Guards/EnsureUserEmailVerified';
import { EnsureAuthNotAuthenticated } from './Guards/EnsureAuthNotAuthenticated';
import { EnsureUserEmailNotVerified } from './Guards/EnsureUserEmailNotVerified';

const EmailConfirmation = LazyLoader({
  loader: () => import('@/containers/Authentication/EmailConfirmation'),
});
const RegisterVerify = LazyLoader({
  loader: () => import('@/containers/Authentication/RegisterVerify'),
});

/**
 * App inner.
 */
function AppInsider({ history }) {
  return (
    <div className="App">
      <DashboardThemeProvider>
        <Router history={history}>
          <Switch>
            <CompatRoute path={'/auth/register/verify'}>
              <EnsureAuthenticated>
                <EnsureUserEmailNotVerified>
                  <RegisterVerify />
                </EnsureUserEmailNotVerified>
              </EnsureAuthenticated>
            </CompatRoute>

            <CompatRoute path={'/auth/email_confirmation'}>
              <EmailConfirmation />
            </CompatRoute>

            <CompatRoute path={'/auth'}>
              <EnsureAuthNotAuthenticated>
                <Authentication />
              </EnsureAuthNotAuthenticated>
            </CompatRoute>

            <CompatRoute path={'/'}>
              <EnsureAuthenticated>
                <EnsureUserEmailVerified>
                  <DashboardPrivatePages />
                </EnsureUserEmailVerified>
              </EnsureAuthenticated>
            </CompatRoute>
          </Switch>
        </Router>

        <GlobalErrors />
      </DashboardThemeProvider>
    </div>
  );
}

/**
 * Core application.
 */
export default function App() {
  // Browser history.
  const history = createBrowserHistory();

  // Query client.
  const queryClient = new QueryClient(queryConfig);

  return (
    <QueryClientProvider client={queryClient}>
      <SplashScreen />

      <AppIntlLoader>
        <AppInsider history={history} />
      </AppIntlLoader>

      <ReactQueryDevtools initialIsOpen />
    </QueryClientProvider>
  );
}
