import React from 'react';
import { Redirect } from 'react-router-dom';
import { useCurrentOrganization } from '@/hooks/query';

interface EnsureOrganizationIsReadyProps {
  children: React.ReactNode;
  redirectTo?: string;
}

function EnsureOrganizationIsReady({
  // #ownProps
  children,
  redirectTo = '/setup',
}: EnsureOrganizationIsReadyProps) {
  const { data: organization } = useCurrentOrganization();
  const isOrganizationReady = !!organization?.isReady;

  return isOrganizationReady ? (
    <>{children}</>
  ) : (
    <Redirect to={{ pathname: redirectTo }} />
  );
}

export default EnsureOrganizationIsReady;
