// @ts-nocheck
import React from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { compose } from '@/utils';
import withAuthentication from '@/containers/Authentication/withAuthentication';
import withOrganization from '@/containers/Organization/withOrganization';

/**
 * Ensures organization is not ready.
 */
function EnsureOrganizationIsNotReady({
  children,

  // #withOrganization
  isOrganizationReady,
  isOrganizationSetupCompleted
}) {
  return (isOrganizationReady && !isOrganizationSetupCompleted) ? (
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
  withOrganization(({
    isOrganizationReady,
    isOrganizationSetupCompleted
  }) => ({
    isOrganizationReady,
    isOrganizationSetupCompleted
  })),
)(EnsureOrganizationIsNotReady);