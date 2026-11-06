import React from 'react';
import { createSelector } from 'reselect';
import type { DashboardExtensionMeta } from '@/store/dashboard/dashboard.types';
import type { RootState } from '@/store/reducers';
import { setExtensionsDashboardMeta } from '@/store/dashboard/dashboard.actions';
import { useAppDispatch, useAppSelector } from '@/store/hooks';

const extensionsSelector = createSelector(
  (state: RootState) => state.dashboard.extensions,
  (extensions) => extensions,
);

/**
 * Returns the extensions enabled for the current organization.
 *
 * The boot metadata endpoint only returns enabled extensions, so every entry
 * is considered enabled.
 */
export const useExtensions = () => {
  const extensions = useAppSelector(extensionsSelector);

  return React.useMemo(() => {
    const enabledIds = new Set(extensions.map((extension) => extension.id));

    return {
      extensions,
      enabledIds,
      isEnabled: (extensionId: string) => enabledIds.has(extensionId),
      getSettings: (extensionId: string) =>
        extensions.find((extension) => extension.id === extensionId)?.settings,
      getVersion: (extensionId: string) =>
        extensions.find((extension) => extension.id === extensionId)?.version ??
        '',
    };
  }, [extensions]);
};

/**
 * Stores the enabled extensions from the dashboard boot metadata.
 */
export const useSetExtensionsDashboardMeta = () => {
  const dispatch = useAppDispatch();

  return React.useCallback(
    (meta: { extensions: DashboardExtensionMeta[] }) => {
      dispatch(setExtensionsDashboardMeta({ extensions: meta.extensions }));
    },
    [dispatch],
  );
};
