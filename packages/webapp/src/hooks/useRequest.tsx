import { createApiFetcher } from '@bigcapital/sdk-ts';
import axios from 'axios';
import React from 'react';
import { getCookie, normalizeApiPath } from '../utils';
import {
  useAuthActions,
  useAuthOrganizationId,
  useSetGlobalErrors,
  useAuthToken,
} from './state';
import { useApiFetcherOnError } from './useApiFetcherOnError';
import type { AxiosError, AxiosRequestConfig } from 'axios';

export default function useApiRequest() {
  const setGlobalErrors = useSetGlobalErrors();
  const { setLogout } = useAuthActions();
  const currentLocale = getCookie('locale');

  // Authentication token.
  const token = useAuthToken();

  // Authentication organization id.
  const organizationId = useAuthOrganizationId();

  const http = React.useMemo(() => {
    // Axios instance.
    const instance = axios.create();

    // Request interceptors.
    instance.interceptors.request.use(
      (request) => {
        const locale = currentLocale;

        if (token) {
          request.headers['Authorization'] = `Bearer ${token}`;
        }
        if (organizationId) {
          request.headers['organization-id'] = organizationId;
        }
        if (locale) {
          request.headers['Accept-Language'] = locale;
        }
        return request;
      },
      (error) => {
        return Promise.reject(error);
      },
    );
    // Response interceptors.
    instance.interceptors.response.use(
      (response) => response,
      (
        error: AxiosError<{
          errors?: Array<{
            type: string;
            payload?: Record<string, unknown>;
          }>;
          message?: string;
        }>,
      ) => {
        const { status, data } = error.response || {};

        if (typeof status !== 'number') {
          return Promise.reject(error);
        }
        if (status >= 500) {
          setGlobalErrors({ something_wrong: true });
        }
        if (status === 401) {
          setGlobalErrors({ session_expired: true });
          setLogout();
        }
        if (status === 403) {
          setGlobalErrors({ access_denied: { message: data?.message } });
        }
        if (status === 429) {
          setGlobalErrors({ too_many_requests: true });
        }
        if (status === 400 && data && Array.isArray(data.errors)) {
          const lockedError = data.errors.find(
            (error) => error.type === 'TRANSACTIONS_DATE_LOCKED',
          );
          if (lockedError) {
            setGlobalErrors({ transactionsLocked: { ...lockedError.payload } });
          }
          if (
            data.errors.find(
              (e) => e.type === 'ORGANIZATION.SUBSCRIPTION.INACTIVE',
            )
          ) {
            setGlobalErrors({ subscriptionInactive: true });
          }
          if (data.errors.find((e) => e.type === 'USER_INACTIVE')) {
            setGlobalErrors({ userInactive: true });
            setLogout();
          }
        }
        return Promise.reject(error);
      },
    );
    return instance;
  }, [token, organizationId, setGlobalErrors, setLogout]);

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
