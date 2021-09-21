import React from 'react';
import * as R from 'ramda';

import withDashboardActions from '../../containers/Dashboard/withDashboardActions';

function AuthenticationBootJSX({ setAppIsLoading }) {
  React.useEffect(() => {
    setAppIsLoading(false);
  }, [setAppIsLoading]);

  return null;
}
export const AuthenticationBoot = R.compose(withDashboardActions)(
  AuthenticationBootJSX,
);
