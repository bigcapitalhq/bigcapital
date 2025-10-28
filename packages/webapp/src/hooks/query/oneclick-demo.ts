// @ts-nocheck
import {
  useMutation,
  UseMutationOptions,
  UseMutationResult,
  useQueryClient,
} from 'react-query';
import useApiRequest from '../useRequest';
import {
  useSetAuthToken,
  useSetAuthUserId,
  useSetLocale,
  useSetOrganizationId,
  useSetTenantId,
} from '../state';
import { setAuthLoginCookies } from './authentication';
import { batch } from 'react-redux';

interface CreateOneClickDemoValues { }
interface CreateOneClickDemoRes {
  email: string;
  signedIn: any;
  buildJob: any;
}

/**
 * Creates one-click demo account.
 * @param {UseMutationOptions<CreateOneClickDemoRes, Error, CreateOneClickDemoValues>} props
 * @returns {UseMutationResult<CreateOneClickDemoRes, Error, CreateOneClickDemoValues>}
 */
export function useCreateOneClickDemo(
  props?: UseMutationOptions<
    CreateOneClickDemoRes,
    Error,
    CreateOneClickDemoValues
  >,
): UseMutationResult<CreateOneClickDemoRes, Error, CreateOneClickDemoValues> {
  const queryClient = useQueryClient();
  const apiRequest = useApiRequest();

  return useMutation<CreateOneClickDemoRes, Error, CreateOneClickDemoValues>(
    () => apiRequest.post(`/demo/one_click`),
    {
      onSuccess: (res, id) => { },
      ...props,
    },
  );
}

interface OneClickSigninDemoValues {
  demoId: string;
}
interface OneClickSigninDemoRes { }

/**
 * Sign-in to the created one-click demo account.
 * @param {UseMutationOptions<OneClickSigninDemoRes, Error, OneClickSigninDemoValues>} props
 * @returns {UseMutationResult<OneClickSigninDemoRes, Error, OneClickSigninDemoValues>}
 */
export function useOneClickDemoSignin(
  props?: UseMutationOptions<
    OneClickSigninDemoRes,
    Error,
    OneClickSigninDemoValues
  >,
): UseMutationResult<OneClickSigninDemoRes, Error, OneClickSigninDemoValues> {
  const queryClient = useQueryClient();
  const apiRequest = useApiRequest();

  const setAuthToken = useSetAuthToken();
  const setOrganizationId = useSetOrganizationId();
  const setUserId = useSetAuthUserId();
  const setTenantId = useSetTenantId();
  const setLocale = useSetLocale();

  return useMutation<OneClickSigninDemoRes, Error, OneClickSigninDemoValues>(
    ({ demoId }) =>
      apiRequest.post(`/demo/one_click_signin`, { demo_id: demoId }),
    {
      onSuccess: (res, id) => {
        // Set authentication cookies.
        setAuthLoginCookies(res.data);

        batch(() => {
          // Sets the auth metadata to global state.
          setAuthToken(res.data.token);
          setOrganizationId(res.data.tenant.organization_id);
          setUserId(res.data.user.id);
          setTenantId(res.data.tenant.id);

          if (res.data?.tenant?.metadata?.language) {
            setLocale(res.data?.tenant?.metadata?.language);
          }
        });
      },
      ...props,
    },
  );
}
