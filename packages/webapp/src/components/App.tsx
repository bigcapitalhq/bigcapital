// @ts-nocheck
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { createBrowserHistory } from 'history';
import { lazy, Suspense } from 'react';
import { Router, Switch, Route } from 'react-router';

import '@/style/App.scss';

import { SplashScreen, DashboardThemeProvider } from '../components';
import { queryConfig } from '../hooks/query/base';
import AppIntlLoader from './AppIntlLoader';
import { EnsureUserEmailNotVerified } from './Guards/EnsureUserEmailNotVerified';
import { EnsureAuthenticated } from '@/components/Guards/EnsureAuthenticated';
import { GlobalErrors } from '@/containers/GlobalErrors/GlobalErrors';

const DashboardPrivatePages = lazy(
  () => import('@/components/Dashboard/PrivatePages'),
);
const AuthenticationPage = lazy(() =>
  import('@/containers/Authentication/AuthenticationPage').then((m) => ({
    default: m.AuthenticationPage,
  })),
);
const EmailConfirmation = lazy(() =>
  import('@/containers/Authentication/EmailConfirmation').then((m) => ({
    default: m.EmailConfirmation,
  })),
);
const RegisterVerify = lazy(() =>
  import('@/containers/Authentication/RegisterVerify').then((m) => ({
    default: m.RegisterVerify,
  })),
);
const OneClickDemoPage = lazy(() =>
  import('@/containers/OneClickDemo/OneClickDemoPage').then((m) => ({
    default: m.OneClickDemoPage,
  })),
);
const PaymentPortalPage = lazy(() =>
  import('@/containers/PaymentPortal/PaymentPortalPage').then((m) => ({
    default: m.PaymentPortalPage,
  })),
);

/**
 * App inner.
 */
function AppInsider({ history }) {
  return (
    <div className="App">
      <DashboardThemeProvider>
        <Suspense fallback={'Loading...'}>
          <Router history={history}>
            <Switch>
              <Route path={'/one_click_demo'} children={<OneClickDemoPage />} />
              <Route path={'/auth/register/verify'}>
                <EnsureAuthenticated>
                  <EnsureUserEmailNotVerified>
                    <RegisterVerify />
                  </EnsureUserEmailNotVerified>
                </EnsureAuthenticated>
              </Route>

              <Route
                path={'/auth/email_confirmation'}
                children={<EmailConfirmation />}
              />
              <Route path={'/auth'} children={<AuthenticationPage />} />
              <Route
                path={'/payment/:linkId'}
                children={<PaymentPortalPage />}
              />
              <Route path={'/'} children={<DashboardPrivatePages />} />
            </Switch>
          </Router>
        </Suspense>

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
