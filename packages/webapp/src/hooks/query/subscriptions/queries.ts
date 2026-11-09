import { getLemonCheckoutUrl } from '@bigcapital/sdk-ts';
import { useMutation, UseMutationOptions } from '@tanstack/react-query';
import { useApiFetcher } from '../../useRequest';

export interface LemonCheckoutRequest {
  variantId: string;
}

export interface LemonCheckoutResponse {
  data: {
    data: {
      attributes: {
        url: string;
      };
    };
  };
}

/**
 * Fetches the checkout url of the Lemon Squeezy.
 */
export const useGetLemonSqueezyCheckout = (
  props?: UseMutationOptions<
    LemonCheckoutResponse,
    Error,
    LemonCheckoutRequest
  >,
) => {
  const fetcher = useApiFetcher();

  return useMutation({
    ...props,
    mutationFn: (values: LemonCheckoutRequest) =>
      getLemonCheckoutUrl(
        fetcher,
        values as never,
      ) as Promise<LemonCheckoutResponse>,
  });
};
