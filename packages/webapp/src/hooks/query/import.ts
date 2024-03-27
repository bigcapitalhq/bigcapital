// @ts-nocheck
import { useMutation, useQuery, useQueryClient } from 'react-query';
import useApiRequest from '../useRequest';
import { transformToCamelCase } from '@/utils';
import { downloadFile, useDownloadFile } from '../useDownloadFile';

const QueryKeys = {
  ImportPreview: 'ImportPreview',
  ImportFileMeta: 'ImportFileMeta',
};
/**
 *
 */
export function useImportFileUpload(props = {}) {
  const queryClient = useQueryClient();
  const apiRequest = useApiRequest();

  return useMutation((values) => apiRequest.post(`import/file`, values), {
    onSuccess: (res, id) => {
      // Invalidate queries.
    },
    ...props,
  });
}

export function useImportFileMapping(props = {}) {
  const queryClient = useQueryClient();
  const apiRequest = useApiRequest();

  return useMutation(
    ([importId, values]) =>
      apiRequest.post(`import/${importId}/mapping`, values),
    {
      onSuccess: (res, id) => {
        // Invalidate queries.
        queryClient.invalidateQueries([QueryKeys.ImportPreview]);
        queryClient.invalidateQueries([QueryKeys.ImportFileMeta]);
      },
      ...props,
    },
  );
}

export function useImportFilePreview(importId: string, props = {}) {
  const queryClient = useQueryClient();
  const apiRequest = useApiRequest();

  return useQuery([QueryKeys.ImportPreview, importId], () =>
    apiRequest
      .get(`import/${importId}/preview`)
      .then((res) => transformToCamelCase(res.data)),
  );
}

export function useImportFileMeta(importId: string, props = {}) {
  const queryClient = useQueryClient();
  const apiRequest = useApiRequest();

  return useQuery([QueryKeys.ImportFileMeta, importId], () =>
    apiRequest
      .get(`import/${importId}`)
      .then((res) => transformToCamelCase(res.data)),
  );
}

/**
 *
 */
export function useImportFileProcess(props = {}) {
  const queryClient = useQueryClient();
  const apiRequest = useApiRequest();

  return useMutation(
    (importId) => apiRequest.post(`import/${importId}/import`),
    {
      onSuccess: (res, id) => {
        // Invalidate queries.
      },
      ...props,
    },
  );
}

interface SampleSheetImportQuery {
  resource: string;
  filename: string;
  format: 'xlsx' | 'csv';
}

/**
 * Initiates a download of the balance sheet in XLSX format.
 * @param {Object} query - The query parameters for the request.
 * @param {Object} args - Additional configurations for the download.
 * @returns {Function} A function to trigger the file download.
 */
export const useSampleSheetImport = () => {
  const apiRequest = useApiRequest();

  return useMutation<void, AxiosError, IArgs>(
    (data: SampleSheetImportQuery) => {
      return apiRequest
        .get('/import/sample', {
          responseType: 'blob',
          headers: {
            accept:
              data.format === 'xlsx' ? 'application/xlsx' : 'application/csv',
          },
          params: {
            resource: data.resource,
            format: data.format,
          },
        })
        .then((res) => {
          downloadFile(res.data, `${data.filename}.${data.format}`);
          return res;
        });
    },
  );
};
