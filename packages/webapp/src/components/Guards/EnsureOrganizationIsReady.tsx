// @ts-nocheck
import React from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';

import { withAuthentication } from '@/containers/Authentication/withAuthentication';
import { withOrganization } from '@/containers/Organization/withOrganization';
import { flow } from 'fp-ts/function';

function EnsureOrganizationIsReady({
  // #ownProps
  children,
  redirectTo = '/setup',

  // #withOrganizationByOrgId
  isOrganizationReady,
}) {
  return isOrganizationReady ? (
    children
  ) : (
    <Redirect to={{ pathname: redirectTo }} />
  );
}

export default flow(
  withOrganization(({ isOrganizationReady }) => ({ isOrganizationReady })),
  connect((state, props) => ({
    organizationId: props.currentOrganizationId,
  })),
  withAuthentication(),
)(EnsureOrganizationIsReady);
