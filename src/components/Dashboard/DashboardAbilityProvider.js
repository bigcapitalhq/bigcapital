import React from 'react';
import { Ability } from '@casl/ability';
import { createContextualCan } from '@casl/react';
import { useDashboardMeta } from '../../hooks/query';

export const AbilityContext = React.createContext();
export const Can = createContextualCan(AbilityContext.Consumer);

/**
 * Dashboard ability provider.
 */
export function DashboardAbilityProvider({ children }) {
  const {
    data: { abilities },
  } = useDashboardMeta();

  // Ability instance.
  const ability = new Ability([]);

  return (
    <AbilityContext.Provider value={ability}>
      {children}
    </AbilityContext.Provider>
  );
}
