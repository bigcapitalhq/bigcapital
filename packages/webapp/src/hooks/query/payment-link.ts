// @ts-nocheck
import {
  UseMutationOptions,
  UseMutationResult,
  UseQueryOptions,
  UseQueryResult,
  useMutation,
  useQuery,
} from 'react-query';
import useApiRequest from '../useRequest';
import { transformToCamelCase, transfromToSnakeCase } from '@/utils';

const GetPaymentLinkInvoice = 'GetPaymentLinkInvoice';

// Create Payment Link
// ------------------------------------
interface CreatePaymentLinkValues {
  publicity: string;
  transactionType: string;
  transactionId: number | string;
  expiryDate: string;
}
interface CreatePaymentLinkResponse {
  link: string;
}
/**
 * Creates a new payment link.
 * @param {UseMutationOptions<CreatePaymentLinkResponse, Error, CreatePaymentLinkValues>} options
 * @returns {UseMutationResult<CreatePaymentLinkResponse, Error, CreatePaymentLinkValues>}
 */
export function useCreatePaymentLink(
  options?: UseMutationOptions<
    CreatePaymentLinkResponse,
    Error,
    CreatePaymentLinkValues
  >,
): UseMutationResult<
  CreatePaymentLinkResponse,
  Error,
  CreatePaymentLinkValues
> {
  const apiRequest = useApiRequest();

  return useMutation<CreatePaymentLinkResponse, Error, CreatePaymentLinkValues>(
    (values) =>
      apiRequest
        .post('/payment-links/generate', transfromToSnakeCase(values))
        .then((res) => res.data),
    {
      ...options,
    },
  );
}

// Get Invoice Payment Link
// -----------------------------------------
interface GetInvoicePaymentLinkAddressResponse {
  address_1: string;
  address_2: string;
  postal_code: string;
  city: string;
  state_province: string;
  phone: string;
}

export interface GetInvoicePaymentLinkResponse {
  dueAmount: number;
  dueAmountFormatted: string;
  dueDate: string;
  dueDateFormatted: string;
  invoiceDateFormatted: string;
  invoiceNo: string;
  paymentAmount: number;
  paymentAmountFormatted: string;
  subtotal: number;
  subtotalFormatted: string;
  subtotalLocalFormatted: string;
  total: number;
  totalFormatted: string;
  totalLocalFormatted: string;
  customerName: string;
  invoiceMessage: string;
  termsConditions: string;
  entries: Array<{
    description: string;
    itemName: string;
    quantity: number;
    quantityFormatted: string;
    rate: number;
    rateFormatted: string;
    total: number;
    totalFormatted: string;
  }>;
  taxes: Array<{
    name: string;
    taxRateAmount: number;
    taxRateAmountFormatted: string;
    taxRateCode: string;
  }>;
  organization: Record<
    string,
    {
      address: Record<string, GetInvoicePaymentLinkAddressResponse>;
      name: string;
      primaryColor: string;
      logoUri: string;
      addressTextFormatted: string;
    }
  >;
  hasStripePaymentMethod: boolean;
  isReceivable: boolean;
}

/**
 * Fetches the sharable invoice link metadata for a given link ID.
 * @param {string} linkId - The ID of the link to fetch metadata for.
 * @param {UseQueryOptions<GetInvoicePaymentLinkResponse, Error>} options - Optional query options.
 * @returns {UseQueryResult<GetInvoicePaymentLinkResponse, Error>} The query result.
 */
export function useGetInvoicePaymentLink(
  linkId: string,
  options?: UseQueryOptions<GetInvoicePaymentLinkResponse, Error>,
): UseQueryResult<GetInvoicePaymentLinkResponse, Error> {
  const apiRequest = useApiRequest();

  return useQuery<GetInvoicePaymentLinkResponse, Error>(
    [GetPaymentLinkInvoice, linkId],
    () =>
      apiRequest
        .get(`/payment-links/${linkId}/invoice`)
        .then((res) => transformToCamelCase(res.data?.data)),
    {
      ...options,
    },
  );
}

// Create Stripe Checkout Session.
// ------------------------------------
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
        .post(`/payment-links/${values.linkId}/stripe_checkout_session`, values)
        .then(
          (res) =>
            transformToCamelCase(res.data) as CreateCheckoutSessionResponse,
        );
    },
    { ...options },
  );
};
