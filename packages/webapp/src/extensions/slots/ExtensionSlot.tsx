import React, { Suspense } from 'react';
import { useExtensions } from '../hooks/useExtensions';
import { ExtensionSlotErrorBoundary } from './ExtensionSlotErrorBoundary';
import { ExtensionSlotGuard } from './ExtensionSlotGuard';
import { getSlotContributions } from './slot.registry';
import type { ExtensionSlotContexts, ExtensionSlotName } from './slot.types';

interface ExtensionSlotProps<K extends ExtensionSlotName> {
  name: K;
  context: ExtensionSlotContexts[K];
  fallback?: React.ReactNode;
}

/**
 * Renders every enabled extension contribution registered for a slot.
 *
 * Each contribution is independently guarded and wrapped in an error boundary
 * and a suspense boundary, so one extension cannot break the host page or the
 * other contributions in the same slot.
 */
export function ExtensionSlot<K extends ExtensionSlotName>({
  name,
  context,
  fallback = null,
}: ExtensionSlotProps<K>) {
  const { enabledIds } = useExtensions();
  const contributions = getSlotContributions(name, enabledIds);

  if (contributions.length === 0) {
    return null;
  }

  return (
    <>
      {contributions.map((contribution) => {
        const Component = contribution.component as React.ComponentType<
          ExtensionSlotContexts[K]
        >;

        return (
          <ExtensionSlotErrorBoundary
            key={contribution.id}
            extensionId={contribution.extensionId}
          >
            <ExtensionSlotGuard
              feature={contribution.feature}
              permission={contribution.permission}
            >
              <Suspense fallback={fallback}>
                <Component {...context} />
              </Suspense>
            </ExtensionSlotGuard>
          </ExtensionSlotErrorBoundary>
        );
      })}
    </>
  );
}
