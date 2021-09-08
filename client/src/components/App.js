import React from 'react';
import { Router, Switch, Route } from 'react-router';
import { createBrowserHistory } from 'history';
import { QueryClientProvider, QueryClient } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';

import 'style/App.scss';
import 'moment/locale/ar-ly';
import 'moment/locale/es-us'

import AppIntlLoader from './AppIntlLoader';
import PrivateRoute from 'components/Guards/PrivateRoute';
import GlobalErrors from 'containers/GlobalErrors/GlobalErrors';
import DashboardPrivatePages from 'components/Dashboard/PrivatePages';
import Authentication from 'components/Authentication';
import { SplashScreen } from '../components';
import { queryConfig } from '../hooks/query/base'

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
        <div className="App">
          <Router history={history}>
            <Switch>
              <Route path={'/auth'} component={Authentication} />
              <Route path={'/'}>
                <PrivateRoute component={DashboardPrivatePages} />
              </Route>
            </Switch>
          </Router>

          <GlobalErrors />
        </div>
      </AppIntlLoader>

      <ReactQueryDevtools initialIsOpen />
    </QueryClientProvider>
  );
}