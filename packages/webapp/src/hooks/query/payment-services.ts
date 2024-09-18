// @ts-nocheck
import { useQuery, UseQueryOptions, UseQueryResult } from 'react-query';
import useApiRequest from '../useRequest';
import { transformToCamelCase } from '@/utils';

const PaymentServicesQueryKey = 'PaymentServices';

export interface GetPaymentServicesResponse {
  
}

export const useGetPaymentServices = (
  options?: UseQueryOptions<GetPaymentServicesResponse, Error>,
): UseQueryResult<GetPaymentServicesResponse, Error> => {
  const apiRequest = useApiRequest();

  return useQuery<GetPaymentServicesResponse, Error>(
    [PaymentServicesQueryKey],
    () =>
      apiRequest
        .get('/payment-services')
        .then(
          (response) =>
            transformToCamelCase(
              response.data?.paymentServices,
            ) as GetPaymentServicesResponse,
        ),
    {
      ...options,
    },
  );
};
