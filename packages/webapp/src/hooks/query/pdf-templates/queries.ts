import {
  fetchPdfTemplates,
  fetchPdfTemplate,
  createPdfTemplate,
  editPdfTemplate,
  deletePdfTemplate,
  assignPdfTemplateAsDefault,
  fetchPdfTemplateBrandingState,
} from '@bigcapital/sdk-ts';
import {
  useMutation,
  useQuery,
  useQueryClient,
  UseMutationOptions,
  UseQueryOptions,
  UseMutationResult,
  UseQueryResult,
} from '@tanstack/react-query';
import { useApiFetcher } from '../../useRequest';
import { creditNotesKeys } from '../credit-note/query-keys';
import { estimatesKeys } from '../estimates/query-keys';
import { invoicesKeys } from '../invoices/query-keys';
import { paymentReceivesKeys } from '../payment-receives/query-keys';
import { receiptsKeys } from '../receipts/query-keys';
import { pdfTemplatesKeys } from './query-keys';
import type {
  CreatePdfTemplateBody,
  EditPdfTemplateBody,
  PdfTemplateResponse,
  PdfTemplatesListResponse,
  PdfTemplateBrandingStateResponse,
  GetPdfTemplatesQuery,
} from '@bigcapital/sdk-ts';

// Re-export types for consumers (aliases for SDK types)
export type CreatePdfTemplateValues = CreatePdfTemplateBody;
export type CreatePdfTemplateResponse = void;

export type EditPdfTemplateValues = EditPdfTemplateBody;
export type EditPdfTemplateResponse = void;

export interface DeletePdfTemplateValues {
  templateId: number | string;
}
export type DeletePdfTemplateResponse = void;

export type GetPdfTemplateResponse = PdfTemplateResponse;

export type GetPdfTemplatesResponse = PdfTemplatesListResponse;

export type AssignPdfTemplateAsDefaultValues = { templateId: number };
export type AssignPdfTemplateAsDefaultResponse = void;

export type GetPdfTemplateBrandingStateResponse =
  PdfTemplateBrandingStateResponse;

function invalidatePdfTemplateQueries(
  queryClient: ReturnType<typeof useQueryClient>,
) {
  queryClient.invalidateQueries({ queryKey: pdfTemplatesKeys.all() });
}

// Hook for creating a PDF template
export function useCreatePdfTemplate(
  options?: UseMutationOptions<
    CreatePdfTemplateResponse,
    Error,
    CreatePdfTemplateValues
  >,
): UseMutationResult<
  CreatePdfTemplateResponse,
  Error,
  CreatePdfTemplateValues
> {
  const queryClient = useQueryClient();
  const fetcher = useApiFetcher();

  return useMutation({
    mutationFn: (values: CreatePdfTemplateValues) =>
      createPdfTemplate(fetcher, values),
    onSuccess: () => invalidatePdfTemplateQueries(queryClient),
    ...options,
  });
}

// Hook for editing a PDF template
export function useEditPdfTemplate(
  options?: UseMutationOptions<
    EditPdfTemplateResponse,
    Error,
    { templateId: number; values: EditPdfTemplateValues }
  >,
): UseMutationResult<
  EditPdfTemplateResponse,
  Error,
  { templateId: number; values: EditPdfTemplateValues }
> {
  const queryClient = useQueryClient();
  const fetcher = useApiFetcher();

  return useMutation({
    mutationFn: ({
      templateId,
      values,
    }: {
      templateId: number;
      values: EditPdfTemplateValues;
    }) => editPdfTemplate(fetcher, templateId, values),
    onSuccess: () => invalidatePdfTemplateQueries(queryClient),
    ...options,
  });
}

// Hook for deleting a PDF template
export function useDeletePdfTemplate(
  options?: UseMutationOptions<
    DeletePdfTemplateResponse,
    Error,
    { templateId: number }
  >,
): UseMutationResult<DeletePdfTemplateResponse, Error, { templateId: number }> {
  const queryClient = useQueryClient();
  const fetcher = useApiFetcher();

  return useMutation({
    mutationFn: ({ templateId }: { templateId: number }) =>
      deletePdfTemplate(fetcher, templateId),
    onSuccess: () => invalidatePdfTemplateQueries(queryClient),
    ...options,
  });
}

// Hook for getting a single PDF template
export function useGetPdfTemplate(
  templateId: number,
  options?: Omit<
    UseQueryOptions<GetPdfTemplateResponse, Error>,
    'queryKey' | 'queryFn'
  >,
): UseQueryResult<GetPdfTemplateResponse, Error> {
  const fetcher = useApiFetcher({ enableCamelCaseTransform: true });

  return useQuery({
    queryKey: pdfTemplatesKeys.detail(templateId),
    queryFn: () => fetchPdfTemplate(fetcher, templateId),
    enabled: !!templateId,
    ...options,
  });
}

// Hook for getting multiple PDF templates
export function useGetPdfTemplates(
  query?: GetPdfTemplatesQuery,
  options?: UseQueryOptions<GetPdfTemplatesResponse, Error>,
): UseQueryResult<GetPdfTemplatesResponse, Error> {
  const fetcher = useApiFetcher({ enableCamelCaseTransform: true });

  return useQuery({
    queryKey: pdfTemplatesKeys.list(query),
    queryFn: () => fetchPdfTemplates(fetcher, query),
    ...options,
  });
}

// Hook for assigning a PDF template as default
export function useAssignPdfTemplateAsDefault(
  options?: UseMutationOptions<
    AssignPdfTemplateAsDefaultResponse,
    Error,
    AssignPdfTemplateAsDefaultValues
  >,
): UseMutationResult<
  AssignPdfTemplateAsDefaultResponse,
  Error,
  AssignPdfTemplateAsDefaultValues
> {
  const queryClient = useQueryClient();
  const fetcher = useApiFetcher();

  return useMutation({
    mutationFn: ({ templateId }: AssignPdfTemplateAsDefaultValues) =>
      assignPdfTemplateAsDefault(fetcher, templateId),
    onSuccess: () => {
      invalidatePdfTemplateQueries(queryClient);
      queryClient.invalidateQueries({ queryKey: invoicesKeys.state() });
      queryClient.invalidateQueries({ queryKey: estimatesKeys.state() });
      queryClient.invalidateQueries({ queryKey: receiptsKeys.state() });
      queryClient.invalidateQueries({ queryKey: creditNotesKeys.state() });
      queryClient.invalidateQueries({ queryKey: paymentReceivesKeys.state() });
    },
    ...options,
  });
}

// Retrieve organization branding state.
export function useGetPdfTemplateBrandingState(
  options?: UseQueryOptions<GetPdfTemplateBrandingStateResponse, Error>,
): UseQueryResult<GetPdfTemplateBrandingStateResponse, Error> {
  const fetcher = useApiFetcher({ enableCamelCaseTransform: true });

  return useQuery({
    queryKey: pdfTemplatesKeys.state(),
    queryFn: () => fetchPdfTemplateBrandingState(fetcher),
    ...options,
  });
}
