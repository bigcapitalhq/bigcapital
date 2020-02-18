import React from 'react';
import PropTypes from 'prop-types';
import {IntlProvider} from 'react-intl';
import {connect} from 'react-redux';
import PrivateRoute from 'components/PrivateRoute';
import Authentication from 'components/Authentication';
import Dashboard from 'components/Dashboard/Dashboard';
// import {isAuthenticated} from 'reducers/authentication'
import messages from 'lang/en';
import 'style/App.scss';

function App(props) {
  return (
    <IntlProvider locale={props.locale} messages={messages}>
      <div className="App">
        <Authentication isAuthenticated={props.isAuthorized} />
        <PrivateRoute isAuthenticated={props.isAuthorized} component={Dashboard} />
      </div>
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
  isAuthorized: true,
});
export default connect(mapStateToProps)(App);