import React from 'react';
import { RawIntlProvider } from 'react-intl';
import { Router, Switch, Route } from 'react-router';
import { createBrowserHistory } from 'history';
import { ReactQueryConfigProvider } from 'react-query';
import { ReactQueryDevtools } from 'react-query-devtools';

import PrivateRoute from 'components/Guards/PrivateRoute';
import Authentication from 'components/Authentication';
import DashboardPrivatePages from 'components/Dashboard/PrivatePages';
import GlobalErrors from 'containers/GlobalErrors/GlobalErrors';
import intl from 'services/intl';

import 'style/App.scss';

function App({ locale }) {
  const history = createBrowserHistory();

  const queryConfig = {
    queries: {
      refetchOnWindowFocus: false,
    },
  };
  return (
    <RawIntlProvider value={intl}>
      <div className="App">
        <ReactQueryConfigProvider config={queryConfig}>
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
          <ReactQueryDevtools />
        </ReactQueryConfigProvider>
      </div>
    </RawIntlProvider>
  );
}

App.defaultProps = {
  locale: 'en',
};

export default App;
