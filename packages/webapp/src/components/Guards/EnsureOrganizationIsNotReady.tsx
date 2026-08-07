// @ts-nocheck
import React from 'react';
import { Redirect } from 'react-router-dom';
import { useCurrentOrganization } from '@/hooks/query';
import { useIsOrganizationSetupCompleted } from '@/hooks/state';

/**
 * Ensures organization is not ready.
 */
function EnsureOrganizationIsNotReady({ children }) {
  const { data: organization } = useCurrentOrganization();
  const isOrganizationReady = !!organization?.isReady;
  const isOrganizationSetupCompleted = useIsOrganizationSetupCompleted();

  return isOrganizationReady && !isOrganizationSetupCompleted ? (
    <Redirect to={{ pathname: '/' }} />
  ) : (
    children
  );
}

export default EnsureOrganizationIsNotReady;
