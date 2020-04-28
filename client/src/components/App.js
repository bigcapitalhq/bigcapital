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

function App(props) {
  const history = createBrowserHistory();

  return (
    <IntlProvider locale={props.locale} messages={messages}>
      <div className="App">
        <Router history={history}>
          <Authentication isAuthenticated={props.isAuthorized} />
          <PrivateRoute isAuthenticated={props.isAuthorized} component={Dashboard} />
        </Router>
      </div>

      <Progress isAnimating={props.isLoading} />
    </IntlProvider>
  );
}

App.defaultProps = {
  locale: 'en',
};

App.propTypes = {
  locale: PropTypes.string,
  isAuthorized: PropTypes.bool,
};

const mapStateToProps = (state) => ({
  isAuthorized: isAuthenticated(state),
  isLoading: !!state.dashboard.requestsLoading,
});
export default connect(mapStateToProps)(App);