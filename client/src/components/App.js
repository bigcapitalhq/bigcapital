import React from 'react';
import { IntlProvider } from 'react-intl';
import { Router, Switch, Route } from 'react-router';
import { createBrowserHistory } from 'history';
import { ReactQueryConfigProvider } from 'react-query';
import { ReactQueryDevtools } from 'react-query-devtools';

import PrivateRoute from 'components/PrivateRoute';
import Authentication from 'components/Authentication';
import Dashboard from 'components/Dashboard/Dashboard';
import GlobalErrors from 'containers/GlobalErrors/GlobalErrors';

import messages from 'lang/en';
import 'style/App.scss';

function App({ locale }) {
  const history = createBrowserHistory();

  const queryConfig = {
    queries: {
      refetchOnWindowFocus: false,
    }
  };
  return (
    <IntlProvider locale={locale} messages={messages}>
      <div className="App">
        <ReactQueryConfigProvider config={queryConfig}>
          <Router history={history}>
            <Switch>
              <Route path={'/auth'}>
                <Authentication />
              </Route>

              <Route path={'/'}>
                <PrivateRoute component={Dashboard} />
              </Route>
            </Switch>
          </Router>

          <GlobalErrors />
          <ReactQueryDevtools />
        </ReactQueryConfigProvider>
      </div>
    </IntlProvider>
  );
}

App.defaultProps = {
  locale: 'en',
};

export default App;
