import React from 'react';
import AbilityContextProvider from '../../components/Can';

/**
 * Dashboard provider.
 */
export default function DashboardProvider({ children }) {
  return <AbilityContextProvider>{children}</AbilityContextProvider>;
}
