import React from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { compose } from 'utils';

import withAuthentication from 'containers/Authentication/withAuthentication';
import withOrganization from 'containers/Organization/withOrganization';


function EnsureOrganizationIsReady({
  // #ownProps
  children,
  redirectTo = '/setup',

  // #withOrganizationByOrgId
  isOrganizationInitialized,
}) {
  return (isOrganizationInitialized) ? children : (
    <Redirect
      to={{ pathname: redirectTo }}
    />
  );
}

export default compose(
  withAuthentication(),
  connect((state, props) => ({
    organizationId: props.currentOrganizationId,
  })),
  withOrganization(({ isOrganizationInitialized }) => ({ isOrganizationInitialized })),
)(EnsureOrganizationIsReady);