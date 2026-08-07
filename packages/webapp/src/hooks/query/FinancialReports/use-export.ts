import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { downloadFile } from '@/hooks/useDownloadFile';
import useApiRequest from '@/hooks/useRequest';

interface ResourceExportValues {
  resource: string;
  format: string;
}

/**
 * Initiates a download of the balance sheet in XLSX format.
 * @param {Object} query - The query parameters for the request.
 * @param {Object} args - Additional configurations for the download.
 * @returns {Function} A function to trigger the file download.
 */
export const useResourceExport = () => {
  const apiRequest = useApiRequest();

  return useMutation<unknown, AxiosError, ResourceExportValues>({
    mutationFn: (data: ResourceExportValues) => {
      return apiRequest.get('/export', {
        responseType: 'blob',
        headers: {
          accept:
            data.format === 'xlsx' ? 'application/xlsx' : 'application/csv',
        },
        params: {
          resource: data.resource,
          format: data.format,
        },
      });
    },
  });
};
