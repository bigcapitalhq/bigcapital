// @ts-nocheck
import {
  useMutation,
  UseMutationOptions,
  UseMutationResult,
} from 'react-query';
import useApiRequest from '../useRequest';
import { transformToCamelCase } from '@/utils';

interface AccountSessionValues {
  connectedAccountId?: string;
}
interface AccountSessionResponse {
  client_secret: string;
}

/**
 * Generates a new Stripe checkout session for the provided link ID.
 * @param {CreateCheckoutSessionValues} values - The values required to create a checkout session.
 * @returns {Promise<CreateCheckoutSessionResponse>} The response containing the checkout session details.
 */
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

interface CreateCheckoutSessionValues {
  linkId: string;
}

interface CreateCheckoutSessionResponse {
  sessionId: string;
  publishableKey: string;
  redirectTo: string;
}

export const useCreateStripeCheckoutSession = (
  options?: UseMutationOptions<
    CreateCheckoutSessionResponse,
    Error,
    CreateCheckoutSessionValues
  >,
): UseMutationResult<
  CreateCheckoutSessionResponse,
  Error,
  CreateCheckoutSessionValues
> => {
  const apiRequest = useApiRequest();

  return useMutation(
    (values: CreateCheckoutSessionValues) => {
      return apiRequest
        .post(
          `/stripe_integration/${values.linkId}/create_checkout_session`,
          values,
        )
        .then(
          (res) =>
            transformToCamelCase(res.data) as CreateCheckoutSessionResponse,
        );
    },
    { ...options },
  );
};
