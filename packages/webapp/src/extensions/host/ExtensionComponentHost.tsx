import React from 'react';
import { useHistory } from 'react-router-dom';
import { useExtensions } from '../hooks/useExtensions';
import type {
  ExtensionApiClient,
  ExtensionComponentContext,
} from '@bigcapital/extension-sdk/web';
import { useAuthOrganizationId, useAuthToken } from '@/hooks/state';

interface ExtensionComponentHostProps {
  extensionId: string;
  component: React.ComponentType<any>;
  props?: Record<string, unknown>;
}

/**
 * Provides the extension host context (`api`, public settings, navigation) to
 * a route or slot component.
 */
export function ExtensionComponentHost({
  extensionId,
  component: Component,
  props = {},
}: ExtensionComponentHostProps) {
  const history = useHistory();
  const token = useAuthToken();
  const organizationId = useAuthOrganizationId();
  const { getSettings, getVersion } = useExtensions();
  const settings = getSettings(extensionId) ?? {};
  const extensionVersion = getVersion(extensionId);

  const api = React.useMemo<ExtensionApiClient>(() => {
    const request = async (
      method: string,
      path: string,
      body?: unknown,
      query?: Record<string, unknown>,
    ) => {
      const params = new URLSearchParams();

      Object.entries(query ?? {}).forEach(([key, value]) => {
        if (value !== undefined) {
          params.set(key, String(value));
        }
      });

      const search = params.toString();
      const response = await fetch(
        `/api/ext/${extensionId}${path}${search ? `?${search}` : ''}`,
        {
          method,
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
            ...(organizationId ? { 'organization-id': organizationId } : {}),
          },
          body: body === undefined ? undefined : JSON.stringify(body),
        },
      );

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        const message =
          data && typeof data === 'object' && 'message' in data
            ? String((data as { message: unknown }).message)
            : `${response.status} ${response.statusText}`;

        throw new Error(`Extension request failed: ${message}`);
      }

      return data;
    };

    return {
      get: (path, options) => request('GET', path, undefined, options?.query),
      post: (path, body) => request('POST', path, body),
      put: (path, body) => request('PUT', path, body),
      delete: (path) => request('DELETE', path),
    };
  }, [extensionId, token, organizationId]);

  const host = React.useMemo<ExtensionComponentContext>(
    () => ({
      extensionId,
      extensionVersion,
      settings,
      api,
      navigate: (path: string) => history.push(path),
    }),
    [extensionId, extensionVersion, settings, api, history],
  );

  return <Component {...props} host={host} />;
}
