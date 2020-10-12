import React from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { compose } from 'utils';
import withAuthentication from 'containers/Authentication/withAuthentication';
import withOrganization from 'containers/Organization/withOrganization';

function EnsureOrganizationIsNotReady({
  children,

  // #withOrganization
  isOrganizationReady,
}) {
  return (isOrganizationReady) ? (
    <Redirect to={{ pathname: '/' }} />
  ) : children;
}

export default compose(
  withAuthentication(({ currentOrganizationId }) => ({
    currentOrganizationId,
  })),
  connect((state, props) => ({
    organizationId: props.currentOrganizationId,
  })),
  withOrganization(({ isOrganizationReady }) => ({ isOrganizationReady })),
)(EnsureOrganizationIsNotReady);