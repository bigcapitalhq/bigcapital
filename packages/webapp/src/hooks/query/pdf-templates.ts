// @ts-nocheck
import {
  useMutation,
  useQuery,
  UseMutationOptions,
  UseQueryOptions,
  UseMutationResult,
  UseQueryResult,
  useQueryClient,
} from 'react-query';
import useApiRequest from '../useRequest';
import { transformToCamelCase, transfromToSnakeCase } from '@/utils';

const PdfTemplatesQueryKey = 'PdfTemplate';

export interface CreatePdfTemplateValues {
  templateName: string;
  resource: string;
  attributes: Record<string, any>;
}

export interface CreatePdfTemplateResponse {}

export interface EditPdfTemplateValues {
  templateName: string;
  attributes: Record<string, any>;
}

export interface EditPdfTemplateResponse {}

export interface DeletePdfTemplateValues {
  templateId: number | string;
}

export interface DeletePdfTemplateResponse {}

export interface GetPdfTemplateValues {}

export interface GetPdfTemplateResponse {
  templateName: string;
  companyLogoUri?: string | null;
  attributes: Record<string, any>;
  predefined: boolean;
  default: boolean;
  createdAt: string;
  updatedAt: string | null;
}

export interface GetPdfTemplatesValues {}

export interface GetPdfTemplatesResponse {}

// Hook for creating a PDF template
export const useCreatePdfTemplate = (
  options?: UseMutationOptions<
    CreatePdfTemplateResponse,
    Error,
    CreatePdfTemplateValues
  >,
): UseMutationResult<
  CreatePdfTemplateResponse,
  Error,
  CreatePdfTemplateValues
> => {
  const apiRequest = useApiRequest();
  const queryClient = useQueryClient();
  return useMutation<CreatePdfTemplateResponse, Error, CreatePdfTemplateValues>(
    (values) =>
      apiRequest
        .post('/pdf-templates', transfromToSnakeCase(values))
        .then((res) => res.data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries([PdfTemplatesQueryKey]);
      },
      ...options,
    },
  );
};

// Hook for editing a PDF template
export const useEditPdfTemplate = (
  options?: UseMutationOptions<
    EditPdfTemplateResponse,
    Error,
    { templateId: number; values: EditPdfTemplateValues }
  >,
): UseMutationResult<
  EditPdfTemplateResponse,
  Error,
  { templateId: number; values: EditPdfTemplateValues }
> => {
  const queryClient = useQueryClient();
  const apiRequest = useApiRequest();
  return useMutation<
    EditPdfTemplateResponse,
    Error,
    { templateId: number; values: EditPdfTemplateValues }
  >(
    ({ templateId, values }) =>
      apiRequest
        .post(`/pdf-templates/${templateId}`, transfromToSnakeCase(values))
        .then((res) => res.data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries([PdfTemplatesQueryKey]);
      },
      ...options,
    },
  );
};

// Hook for deleting a PDF template
export const useDeletePdfTemplate = (
  options?: UseMutationOptions<
    DeletePdfTemplateResponse,
    Error,
    { templateId: number }
  >,
): UseMutationResult<
  DeletePdfTemplateResponse,
  Error,
  { templateId: number }
> => {
  const apiRequest = useApiRequest();
  const queryClient = useQueryClient();
  return useMutation<DeletePdfTemplateResponse, Error, { templateId: number }>(
    ({ templateId }) =>
      apiRequest.delete(`/pdf-templates/${templateId}`).then((res) => res.data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries([PdfTemplatesQueryKey]);
      },
      ...options,
    },
  );
};

// Hook for getting a single PDF template
export const useGetPdfTemplate = (
  templateId: number,
  options?: UseQueryOptions<GetPdfTemplateResponse, Error>,
): UseQueryResult<GetPdfTemplateResponse, Error> => {
  const apiRequest = useApiRequest();
  return useQuery<GetPdfTemplateResponse, Error>(
    [PdfTemplatesQueryKey, templateId],
    () =>
      apiRequest
        .get(`/pdf-templates/${templateId}`)
        .then((res) => transformToCamelCase(res.data)),
    options,
  );
};

// Hook for getting multiple PDF templates
export const useGetPdfTemplates = (
  query?: { resource: string },
  options?: UseQueryOptions<GetPdfTemplatesResponse, Error>,
): UseQueryResult<GetPdfTemplatesResponse, Error> => {
  const apiRequest = useApiRequest();
  return useQuery<GetPdfTemplatesResponse, Error>(
    [PdfTemplatesQueryKey, query],
    () =>
      apiRequest
        .get('/pdf-templates', { params: query })
        .then((res) => res.data),
    options,
  );
};

export interface AssignPdfTemplateAsDefaultValues {
  templateId: number;
}

export interface AssignPdfTemplateAsDefaultResponse {}

export const useAssignPdfTemplateAsDefault = (
  options?: UseMutationOptions<
    AssignPdfTemplateAsDefaultResponse,
    Error,
    AssignPdfTemplateAsDefaultValues
  >,
): UseMutationResult<
  AssignPdfTemplateAsDefaultResponse,
  Error,
  AssignPdfTemplateAsDefaultValues
> => {
  const apiRequest = useApiRequest();
  const queryClient = useQueryClient();
  return useMutation<
    AssignPdfTemplateAsDefaultResponse,
    Error,
    AssignPdfTemplateAsDefaultValues
  >(
    ({ templateId }) =>
      apiRequest
        .post(`/pdf-templates/${templateId}/assign_default`)
        .then((res) => res.data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries([PdfTemplatesQueryKey]);
        queryClient.invalidateQueries(['SALE_INVOICE_STATE']);
        queryClient.invalidateQueries(['SALE_ESTIMATE_STATE']);
        queryClient.invalidateQueries(['SALE_RECEIPT_STATE']);
        queryClient.invalidateQueries(['CREDIT_NOTE_STATE']);
        queryClient.invalidateQueries(['PAYMENT_RECEIVED_STATE']);
      },
      ...options,
    },
  );
};

// Retrieve organization branding state.
// --------------------------------------------------
export interface GetPdfTemplateBrandingStateResponse {
  companyName: string;
  companyAddress: string;
  companyLogoUri: string;
  companyLogoKey: string;
  primaryColor: string;
}

export const useGetPdfTemplateBrandingState = (
  options?: UseQueryOptions<GetPdfTemplateBrandingStateResponse, Error>,
): UseQueryResult<GetPdfTemplateBrandingStateResponse, Error> => {
  const apiRequest = useApiRequest();

  return useQuery<GetPdfTemplateBrandingStateResponse, Error>(
    [PdfTemplatesQueryKey, 'state'],
    () =>
      apiRequest
        .get('/pdf-templates/state')
        .then((res) => transformToCamelCase(res.data?.data)),
    options,
  );
};
