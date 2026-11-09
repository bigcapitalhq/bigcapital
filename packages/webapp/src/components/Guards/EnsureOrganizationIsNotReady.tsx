import React from 'react';
import { Redirect } from 'react-router-dom';
import { useCurrentOrganization } from '@/hooks/query';
import { useIsOrganizationSetupCompleted } from '@/hooks/state';

interface EnsureOrganizationIsNotReadyProps {
  children: React.ReactNode;
}

/**
 * Ensures organization is not ready.
 */
function EnsureOrganizationIsNotReady({
  children,
}: EnsureOrganizationIsNotReadyProps) {
  const { data: organization } = useCurrentOrganization();
  const isOrganizationReady = !!organization?.isReady;
  const isOrganizationSetupCompleted = useIsOrganizationSetupCompleted();

  return isOrganizationReady && !isOrganizationSetupCompleted ? (
    <Redirect to={{ pathname: '/' }} />
  ) : (
    <>{children}</>
  );
}

export default EnsureOrganizationIsNotReady;
