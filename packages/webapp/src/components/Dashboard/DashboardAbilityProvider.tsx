import { Ability, AnyAbility } from '@casl/ability';
import { createContextualCan } from '@casl/react';
import React from 'react';
import { useDashboardMetaBoot } from './DashboardBoot';

export const AbilityContext = React.createContext<AnyAbility | undefined>(
  undefined,
);

type CanProps = {
  I?: unknown;
  do?: unknown;
  a?: unknown;
  an?: unknown;
  this?: unknown;
  on?: unknown;
  field?: string;
  not?: boolean;
  passThrough?: boolean;
  render?: (...args: unknown[]) => React.ReactNode;
  children?: React.ReactNode;
};

export const Can = createContextualCan(
  AbilityContext.Consumer as React.Consumer<AnyAbility>,
) as React.FC<CanProps>;

/**
 * Dashboard ability provider.
 */
export function DashboardAbilityProvider({
  children,
}: {
  children?: React.ReactNode;
}) {
  const { meta } = useDashboardMetaBoot();

  // Ability instance.
  const ability = new Ability(meta?.abilities ?? []);

  return (
    <AbilityContext.Provider value={ability}>
      {children}
    </AbilityContext.Provider>
  );
}
