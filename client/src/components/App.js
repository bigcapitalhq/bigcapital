import React from 'react';
import PropTypes from 'prop-types';
import { IntlProvider } from 'react-intl';
import { connect } from 'react-redux';
import { Router, Switch } from 'react-router';
import { createBrowserHistory } from 'history';
import PrivateRoute from 'components/PrivateRoute';
import Authentication from 'components/Authentication';
import Dashboard from 'components/Dashboard/Dashboard';
import { isAuthenticated } from 'store/authentication/authentication.reducer'
import Progress from 'components/NProgress/Progress';
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

  return (
    <IntlProvider locale={locale} messages={messages}>
      <div className="App">
        <Router history={history}>
          <Authentication isAuthenticated={isAuthorized} />
          <PrivateRoute isAuthenticated={isAuthorized} component={Dashboard} />
        </Router>
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