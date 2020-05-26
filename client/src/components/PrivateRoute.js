import React from 'react';
import PropTypes from 'prop-types';
import BodyClassName from 'react-body-classname';
import { Redirect } from 'react-router-dom';
import withAuthentication from 'containers/Authentication/withAuthentication';
import { compose } from 'utils';


function PrivateRoute({
  component: Component,
  isAuthorized = false,
  ...rest
}) {
  return (
    <BodyClassName className={''}>
      {(isAuthorized) ? (
        <Component />
      ) : (
        <Redirect
          to={{
            pathname: '/auth/login',
          }}
        />
      )}
    </BodyClassName>
  );
}

export default compose(withAuthentication)(PrivateRoute);
