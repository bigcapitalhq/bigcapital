import React from 'react';
import PropTypes from 'prop-types';
import {IntlProvider} from 'react-intl';
// import {Switch} from 'react-router-dom';
import PrivateRoute from 'components/PrivateRoute';
import Authentication from 'components/Authentication';
import Dashboard from 'components/Dashboard/Dashboard';
import messages from 'lang/en';
import 'style/App.scss';

function App(props) {
  return (
    <IntlProvider locale={props.locale} messages={messages}>
      <div className="App">
        <Authentication isAuthenticated={true} />
        <PrivateRoute isAuthenticated={true} component={Dashboard} />
      </div>
    </IntlProvider>
  );
}
App.defaultProps = {
  locale: 'en',
};
App.propTypes = {
  locale: PropTypes.string,
};

export default App;