import React from 'react';
import { RawIntlProvider } from 'react-intl';
import { Router, Switch, Route } from 'react-router';
import { createBrowserHistory } from 'history';
import { QueryClientProvider, QueryClient } from 'react-query';
import 'style/App.scss';

import PrivateRoute from 'components/Guards/PrivateRoute';
import Authentication from 'components/Authentication';
import DashboardPrivatePages from 'components/Dashboard/PrivatePages';
import GlobalErrors from 'containers/GlobalErrors/GlobalErrors';
import intl from 'services/intl';

function App({ locale }) {
  const history = createBrowserHistory();

  const queryConfig = {
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
        staleTime: 30000,
      },
    },
  };
  const queryClient = new QueryClient(queryConfig);

  return (
    <RawIntlProvider value={intl}>
      <QueryClientProvider client={queryClient}>
        <div className="App">
          <Router history={history}>
            <Switch>
              <Route path={'/auth'}>
                <Authentication />
              </Route>

              <Route path={'/'}>
                <PrivateRoute component={DashboardPrivatePages} />
              </Route>
            </Switch>
          </Router>

          <GlobalErrors />
        </div>
      </QueryClientProvider>
    </RawIntlProvider>
  );
}

App.defaultProps = {
  locale: 'en',
};

export default App;
