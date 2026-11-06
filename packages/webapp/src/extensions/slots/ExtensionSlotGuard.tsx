import React from 'react';
import type { ContributionGuard } from '@bigcapital/extension-sdk/web';
import { useAbilityContext } from '@/hooks';
import { useFeatureCan } from '@/hooks/state';

interface ExtensionSlotGuardProps extends ContributionGuard {
  children: React.ReactNode;
}

/**
 * Applies the contribution's feature and permission guards.
 */
export function ExtensionSlotGuard({
  feature,
  permission,
  children,
}: ExtensionSlotGuardProps) {
  const { featureCan } = useFeatureCan();
  const ability = useAbilityContext();

  if (feature && !featureCan(feature)) {
    return null;
  }

  if (permission && !ability.can(permission.action, permission.subject)) {
    return null;
  }

  return <>{children}</>;
}
