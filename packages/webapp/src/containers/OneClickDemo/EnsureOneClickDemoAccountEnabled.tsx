import React from 'react';
import { Redirect } from 'react-router-dom';
import { useOneClickDemoBoot } from './OneClickDemoBoot';

interface EnsureOneClickDemoAccountEnabledProps {
  children: React.ReactNode;
  redirectTo?: string;
}

export const EnsureOneClickDemoAccountEnabled = ({
  children,
  redirectTo = '/',
}: EnsureOneClickDemoAccountEnabledProps) => {
  const { authMeta } = useOneClickDemoBoot();
  const enabled = authMeta?.meta?.one_click_demo?.enable || false;

  if (!enabled) {
    return <Redirect to={{ pathname: redirectTo }} />;
  }
  return <>{children}</>;
};
