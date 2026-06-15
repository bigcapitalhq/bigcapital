import React from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import {
  withAuthentication,
  WithAuthenticationProps,
} from '@/containers/Authentication/withAuthentication';
import {
  withOrganization,
  WithOrganizationProps,
} from '@/containers/Organization/withOrganization';
import { flow } from 'fp-ts/function';

interface EnsureOrganizationIsNotReadyProps
  extends Pick<WithAuthenticationProps, 'currentOrganizationId'>,
    Pick<
      WithOrganizationProps,
      'isOrganizationReady' | 'isOrganizationSetupCompleted'
    > {
  children: React.ReactNode;
}

/**
 * Ensures organization is not ready.
 */
function EnsureOrganizationIsNotReady({
  children,

  // #withOrganization
  isOrganizationReady,
  isOrganizationSetupCompleted,
}: EnsureOrganizationIsNotReadyProps) {
  return isOrganizationReady && !isOrganizationSetupCompleted ? (
    <Redirect to={{ pathname: '/' }} />
  ) : (
    children
  );
}

export default flow(
  withOrganization(({ isOrganizationReady, isOrganizationSetupCompleted }) => ({
    isOrganizationReady,
    isOrganizationSetupCompleted,
  })),
  connect<unknown, unknown, { currentOrganizationId: string | null }>(
    (_state, props) => ({
      organizationId: props.currentOrganizationId,
    }),
  ),
  withAuthentication(({ currentOrganizationId }) => ({
    currentOrganizationId,
  })),
)(EnsureOrganizationIsNotReady);
