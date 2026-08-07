import {
  fetchGetInvoicePaymentLink,
  fetchCreateStripeCheckoutSession,
  fetchGetPaymentLinkInvoicePdf,
  generateSaleInvoiceSharableLink,
} from '@bigcapital/sdk-ts';
import {
  UseMutationOptions,
  UseMutationResult,
  UseQueryOptions,
  UseQueryResult,
  useMutation,
  useQuery,
} from '@tanstack/react-query';
import { useApiFetcher } from '../../useRequest';
import { paymentLinkKeys } from './query-keys';
import type {
  GetInvoicePaymentLinkResponse,
  CreateStripeCheckoutSessionResponse,
} from '@bigcapital/sdk-ts';

// Create Payment Link (sale-invoices generate-link via SDK)
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
  const fetcher = useApiFetcher();

  return useMutation<CreatePaymentLinkResponse, Error, CreatePaymentLinkValues>(
    {
      mutationFn: (values) =>
        generateSaleInvoiceSharableLink(
          fetcher,
          Number(values.transactionId),
        ).then((data) => ({ link: data.link })),
      ...options,
    },
  );
}

// Get Invoice Payment Link
// -----------------------------------------

export type { GetInvoicePaymentLinkResponse };

/**
 * Fetches the sharable invoice link metadata for a given link ID.
 */
export function useGetInvoicePaymentLink(
  linkId: string,
  options?: UseQueryOptions<GetInvoicePaymentLinkResponse, Error>,
): UseQueryResult<GetInvoicePaymentLinkResponse, Error> {
  const fetcher = useApiFetcher({ enableCamelCaseTransform: true });

  return useQuery<GetInvoicePaymentLinkResponse, Error>({
    queryKey: paymentLinkKeys.invoice(linkId),
    queryFn: () => fetchGetInvoicePaymentLink(fetcher, linkId),
    enabled: !!linkId,
    ...options,
  });
}

// Create Stripe Checkout Session
// ------------------------------------
interface CreateCheckoutSessionValues {
  linkId: string;
}

export const useCreateStripeCheckoutSession = (
  options?: UseMutationOptions<
    CreateStripeCheckoutSessionResponse,
    Error,
    CreateCheckoutSessionValues
  >,
): UseMutationResult<
  CreateStripeCheckoutSessionResponse,
  Error,
  CreateCheckoutSessionValues
> => {
  const fetcher = useApiFetcher({ enableCamelCaseTransform: true });

  return useMutation({
    mutationFn: (values: CreateCheckoutSessionValues) =>
      fetchCreateStripeCheckoutSession(fetcher, values.linkId),
    ...options,
  });
};

// Get Payment Link Invoice PDF
// ------------------------------------
interface GeneratePaymentLinkInvoicePdfValues {
  paymentLinkId: string;
}

export const useGeneratePaymentLinkInvoicePdf = (
  options?: UseMutationOptions<
    Blob,
    Error,
    GeneratePaymentLinkInvoicePdfValues
  >,
): UseMutationResult<Blob, Error, GeneratePaymentLinkInvoicePdfValues> => {
  const fetcher = useApiFetcher();

  return useMutation<Blob, Error, GeneratePaymentLinkInvoicePdfValues>({
    mutationFn: (values: GeneratePaymentLinkInvoicePdfValues) =>
      fetchGetPaymentLinkInvoicePdf(fetcher, values.paymentLinkId),
    ...options,
  });
};

export const useGetPaymentLinkInvoicePdf = (
  invoiceId: string,
  options?: UseQueryOptions<Blob, Error>,
): UseQueryResult<Blob, Error> => {
  const fetcher = useApiFetcher();

  return useQuery<Blob, Error>({
    queryKey: paymentLinkKeys.invoicePdf(invoiceId),
    queryFn: () => fetchGetPaymentLinkInvoicePdf(fetcher, invoiceId),
    enabled: !!invoiceId,
    ...options,
  });
};
