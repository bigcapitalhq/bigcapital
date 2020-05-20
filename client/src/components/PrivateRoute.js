import React from 'react';
import PropTypes from 'prop-types';
import BodyClassName from 'react-body-classname'; 
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
    <BodyClassName className={''}>
      <Route
        {...rest}
        path="/"
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
    </BodyClassName>
  );
}

PrivateRoute.propTypes = propTypes;

export default PrivateRoute;