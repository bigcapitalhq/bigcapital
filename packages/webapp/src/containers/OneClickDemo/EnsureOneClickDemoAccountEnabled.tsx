import React from 'react';
import { Redirect } from 'react-router-dom';
import { Config } from '@/config';

interface EnsureOneClickDemoAccountEnabledProps {
  children: React.ReactNode;
  redirectTo?: string;
}

export const EnsureOneClickDemoAccountEnabled = ({
  children,
  redirectTo = '/',
}: EnsureOneClickDemoAccountEnabledProps) => {
  const enabeld = Config.oneClickDemo.enable || false;

  if (!enabeld) {
    return <Redirect to={{ pathname: redirectTo }} />;
  }
  return <>{children}</>;
};
