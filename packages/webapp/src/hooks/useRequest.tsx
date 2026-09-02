import { createApiFetcher } from '@bigcapital/sdk-ts';
import axios from 'axios';
import React from 'react';
import { getCookie, normalizeApiPath } from '../utils';
import { useAuthOrganizationId, useAuthToken } from './state';
import { useApiFetcherOnError } from './useApiFetcherOnError';
import type { AxiosRequestConfig } from 'axios';

/**
 * Returns an ApiFetcher configured with baseUrl and auth headers for use with sdk-ts fetch functions.
 * Use this in query hooks that call fetchAccounts, fetchCreditNotes, etc.
 *
 * @param options - Optional configuration
 * @param options.enableCamelCaseTransform - If true, automatically transforms response data from snake_case to camelCase
 */
export function useApiFetcher(options?: {
  enableCamelCaseTransform?: boolean;
}) {
  const token = useAuthToken();
  const organizationId = useAuthOrganizationId();
  const currentLocale = getCookie('locale');
  const onError = useApiFetcherOnError();

  return React.useMemo(() => {
    const headers: Record<string, string> = {
      accept: 'application/json',
    };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    if (organizationId) {
      headers['organization-id'] = organizationId;
    }
    if (currentLocale) {
      headers['Accept-Language'] = currentLocale;
    }

    return createApiFetcher({
      baseUrl: '',
      init: { headers },
      disableCamelCaseTransform: !options?.enableCamelCaseTransform,
      onError,
    });
  }, [
    token,
    organizationId,
    currentLocale,
    options?.enableCamelCaseTransform,
    onError,
  ]);
}

/**
 * Returns an unauthenticated ApiFetcher for auth flows (signin, signup, reset password, etc.).
 */
export function useAuthApiFetcher() {
  return React.useMemo(() => createApiFetcher({ baseUrl: '' }), []);
}

export function useAuthApiRequest() {
  const http = React.useMemo(() => {
    // Axios instance.
    return axios.create();
  }, []);

  return React.useMemo(
    () => ({
      http,
      get(resource: string, params?: AxiosRequestConfig) {
        return http.get(`/api/${normalizeApiPath(resource)}`, params);
      },
      post(resource: string, params?: unknown, config?: AxiosRequestConfig) {
        return http.post(`/api/${normalizeApiPath(resource)}`, params, config);
      },
      update(resource: string, slug: string, params?: unknown) {
        return http.put(`/api/${normalizeApiPath(resource)}/${slug}`, params);
      },
      put(resource: string, params?: unknown) {
        return http.put(`/api/${normalizeApiPath(resource)}`, params);
      },
      patch(resource: string, params?: unknown, config?: AxiosRequestConfig) {
        return http.patch(`/api/${normalizeApiPath(resource)}`, params, config);
      },
      delete(resource: string, params?: AxiosRequestConfig) {
        return http.delete(`/api/${normalizeApiPath(resource)}`, params);
      },
    }),
    [http],
  );
}
