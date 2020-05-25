import React from 'react';
import { IntlProvider } from 'react-intl';
import { connect } from 'react-redux';
import { Router } from 'react-router';
import { createBrowserHistory } from 'history';
import PrivateRoute from 'components/PrivateRoute';
import Authentication from 'components/Authentication';
import Dashboard from 'components/Dashboard/Dashboard';
import { isAuthenticated } from 'store/authentication/authentication.reducer'
import { ReactQueryConfigProvider } from 'react-query';
import { ReactQueryDevtools } from "react-query-devtools";

import messages from 'lang/en';
import 'style/App.scss';

function App({
  isAuthorized,
  locale,
}) {
  const history = createBrowserHistory();

  history.listen((location, action) => {
    console.log(`new location via ${action}`, location);
  });

  const queryConfig = {
    refetchAllOnWindowFocus: false,
    cacheTime: 10000,
    staleTime: 10000,
  };
  return (
    <IntlProvider locale={locale} messages={messages}>
      <div className="App">
        <ReactQueryConfigProvider config={queryConfig}>
          <Router history={history}>
            <Authentication isAuthenticated={isAuthorized} />
            <PrivateRoute isAuthenticated={isAuthorized} component={Dashboard} />
          </Router>

          <ReactQueryDevtools />
        </ReactQueryConfigProvider>
      </div>
    </IntlProvider>
  );
}

App.defaultProps = {
  locale: 'en',
};

const mapStateToProps = (state) => {
  return {
    isAuthorized: isAuthenticated(state),
  };
};

export default connect(mapStateToProps)(App);