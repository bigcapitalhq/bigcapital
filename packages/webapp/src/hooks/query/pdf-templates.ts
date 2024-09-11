// @ts-nocheck
import {
  useMutation,
  useQuery,
  UseMutationOptions,
  UseQueryOptions,
  UseMutationResult,
  UseQueryResult,
} from 'react-query';
import useApiRequest from '../useRequest';

export interface CreatePdfTemplateValues {
  templateName: string;
  resource: string;
  attributes: Record<string, any>;
}

export interface CreatePdfTemplateResponse {}

export interface EditPdfTemplateValues {
  templateId: string | number;
  templateName: string;
  attributes: Record<string, any>;
}

export interface EditPdfTemplateResponse {}

export interface DeletePdfTemplateValues {
  templateId: number | string;
}

export interface DeletePdfTemplateResponse {}

export interface GetPdfTemplateValues {}

export interface GetPdfTemplateResponse {}

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
  return useMutation<CreatePdfTemplateResponse, Error, CreatePdfTemplateValues>(
    (values) =>
      apiRequest.post('/pdf-templates', values).then((res) => res.data),
    options,
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
  const apiRequest = useApiRequest();
  return useMutation<
    EditPdfTemplateResponse,
    Error,
    { templateId: number; values: EditPdfTemplateValues }
  >(
    ({ templateId, values }) =>
      apiRequest
        .put(`/pdf-templates/${templateId}`, values)
        .then((res) => res.data),
    options,
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
  return useMutation<DeletePdfTemplateResponse, Error, { templateId: number }>(
    ({ templateId }) =>
      apiRequest.delete(`/pdf-templates/${templateId}`).then((res) => res.data),
    options,
  );
};

// Hook for getting a single PDF template
export const useGetPdfTemplate = (
  templateId: number,
  options?: UseQueryOptions<GetPdfTemplateResponse, Error>,
): UseQueryResult<GetPdfTemplateResponse, Error> => {
  const apiRequest = useApiRequest();
  return useQuery<GetPdfTemplateResponse, Error>(
    ['pdfTemplate', templateId],
    () =>
      apiRequest.get(`/pdf-templates/${templateId}`).then((res) => res.data),
    options,
  );
};

// Hook for getting multiple PDF templates
export const useGetPdfTemplates = (
  options?: UseQueryOptions<GetPdfTemplatesResponse, Error>,
): UseQueryResult<GetPdfTemplatesResponse, Error> => {
  const apiRequest = useApiRequest();
  return useQuery<GetPdfTemplatesResponse, Error>(
    'pdfTemplates',
    () => apiRequest.get('/pdf-templates').then((res) => res.data),
    options,
  );
};
