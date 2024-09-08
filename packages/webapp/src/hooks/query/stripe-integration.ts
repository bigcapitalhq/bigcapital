// @ts-nocheck
import {
  useMutation,
  UseMutationOptions,
  UseMutationResult,
} from 'react-query';
import useApiRequest from '../useRequest';

interface AccountSessionValues {
  connectedAccountId?: string;
}
interface AccountSessionResponse {
  client_secret: string;
}

export const useCreateStripeAccountSession = (
  options?: UseMutationOptions<
    AccountSessionResponse,
    Error,
    AccountSessionValues
  >,
): UseMutationResult<AccountSessionResponse, Error, AccountSessionValues> => {
  const apiRequest = useApiRequest();

  return useMutation(
    (values: AccountSessionValues) => {
      return apiRequest
        .post('/stripe_integration/account_session', {
          account: values?.connectedAccountId,
        })
        .then((res) => res.data);
    },
    { ...options },
  );
};

interface CreateStripeAccountValues {}
interface CreateStripeAccountResponse {
  account_id: string;
}

export const useCreateStripeAccount = (
  options?: UseMutationOptions<
    CreateStripeAccountResponse,
    Error,
    CreateStripeAccountValues
  >,
) => {
  const apiRequest = useApiRequest();

  return useMutation(
    (values: CreateStripeAccountValues) => {
      return apiRequest
        .post('/stripe_integration/account')
        .then((res) => res.data);
    },
    { ...options },
  );
};
