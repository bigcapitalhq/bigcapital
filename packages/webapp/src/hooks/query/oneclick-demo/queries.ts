import {
  useMutation,
  type UseMutationOptions,
  type UseMutationResult,
} from '@tanstack/react-query';
import { batch } from 'react-redux';
import {
  useSetAuthToken,
  useSetAuthUserId,
  useSetLocale,
  useSetOrganizationId,
} from '../../state';
import useApiRequest from '../../useRequest';
import { setAuthLoginCookies } from '../authentication';
import type { AuthSigninResponse } from '@bigcapital/sdk-ts';

interface CreateOneClickDemoValues {}
interface CreateOneClickDemoRes {
  data: unknown;
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
  const apiRequest = useApiRequest();

  return useMutation<CreateOneClickDemoRes, Error, CreateOneClickDemoValues>({
    ...props,
    mutationFn: () =>
      apiRequest.post(
        `/demo/one_click`,
      ) as unknown as Promise<CreateOneClickDemoRes>,
    onSuccess: (
      _res: CreateOneClickDemoRes,
      _id: CreateOneClickDemoValues,
    ) => {},
  });
}

interface OneClickSigninDemoValues {
  demoId: string;
}

interface OneClickSigninDemoRes {
  data: {
    token: string;
    tenant: {
      organization_id: string | number;
      metadata?: { language?: string };
    };
    user: { id: string | number };
  };
}

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
  const apiRequest = useApiRequest();

  const setAuthToken = useSetAuthToken();
  const setOrganizationId = useSetOrganizationId();
  const setUserId = useSetAuthUserId();
  const setLocale = useSetLocale();

  return useMutation<OneClickSigninDemoRes, Error, OneClickSigninDemoValues>({
    ...props,
    mutationFn: ({ demoId }) =>
      apiRequest.post(`/demo/one_click_signin`, {
        demo_id: demoId,
      }) as unknown as Promise<OneClickSigninDemoRes>,
    onSuccess: (res, _id) => {
      // Set authentication cookies.
      setAuthLoginCookies(res.data as unknown as AuthSigninResponse);

      batch(() => {
        // Sets the auth metadata to global state.
        setAuthToken(res.data.token);
        setOrganizationId(String(res.data.tenant.organization_id));
        setUserId(String(res.data.user.id));

        if (res.data?.tenant?.metadata?.language) {
          setLocale(res.data?.tenant?.metadata?.language);
        }
      });
    },
  });
}
