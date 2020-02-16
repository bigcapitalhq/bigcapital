import React from 'react';
import PropTypes from 'prop-types';
import { Route, Redirect } from 'react-router-dom';

const propTypes = {
  isAuthenticated: PropTypes.bool,
  component: PropTypes.func.isRequired
};

function PrivateRoute({
  component: Component,
  isAuthenticated = false,
  ...rest
}) {
  return (
    <Route
      {...rest}
      render={_props =>
        isAuthenticated ? (<Component {..._props} />) :
        (
          <Redirect
            to={{
              pathname: '/auth/login',
            }}
          />
        )}
    />
  );
}

PrivateRoute.propTypes = propTypes;

export default PrivateRoute;