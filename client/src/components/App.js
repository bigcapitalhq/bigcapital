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

// Query client config.
const queryConfig = {
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: true,
      staleTime: 30000,
    },
  },
};

// Global fetch query.
function GlobalFetchQuery({
  children
}) {
  window.localStorage.setItem('lang', 'ar-ly');
  return children
}

/**
 * Core application.
 */
function App({ locale }) {
  const history = createBrowserHistory();

  // Query client.
  const queryClient = new QueryClient(queryConfig);

  return (
    <QueryClientProvider client={queryClient}>
      <GlobalFetchQuery>
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
      </GlobalFetchQuery>

      <ReactQueryDevtools initialIsOpen />
    </QueryClientProvider>
  );
}

App.defaultProps = {
  locale: 'en',
};

export default App;
