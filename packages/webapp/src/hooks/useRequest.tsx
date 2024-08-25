// @ts-nocheck
import React from 'react';
import axios from 'axios';
import {
  useAuthActions,
  useAuthOrganizationId,
  useSetGlobalErrors,
  useAuthToken,
} from './state';
import { getCookie } from '../utils';

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
          request.headers['X-Access-Token'] = token;
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
      (error) => {
        const { status, data } = error.response;

        if (status >= 500) {
          setGlobalErrors({ something_wrong: true });
        }
        if (status === 401) {
          setGlobalErrors({ session_expired: true });
          setLogout();
        }
        if (status === 403) {
          setGlobalErrors({ access_denied: true });
        }
        if (status === 429) {
          setGlobalErrors({ too_many_requests: true });
        }
        if (status === 400) {
          if (
            data.errors.find(
              (error) => error.type === 'TRANSACTIONS_DATE_LOCKED',
            )
          ) {
            setGlobalErrors({ transactionsLocked: { ...lockedError.data } });
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

      get(resource, params) {
        return http.get(`/api/${resource}`, params);
      },

      post(resource, params, config) {
        return http.post(`/api/${resource}`, params, config);
      },

      update(resource, slug, params) {
        return http.put(`/api/${resource}/${slug}`, params);
      },

      put(resource, params) {
        return http.put(`/api/${resource}`, params);
      },

      patch(resource, params, config) {
        return http.patch(`/api/${resource}`, params, config);
      },

      delete(resource, params) {
        return http.delete(`/api/${resource}`, params);
      },
    }),
    [http],
  );
}
