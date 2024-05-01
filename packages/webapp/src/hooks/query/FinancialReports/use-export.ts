// @ts-nocheck
import { downloadFile } from '@/hooks/useDownloadFile';
import useApiRequest from '@/hooks/useRequest';
import { AxiosError } from 'axios';
import { useMutation } from 'react-query';

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

  return useMutation<void, AxiosError, any>((data: ResourceExportValues) => {
    return apiRequest
      .get('/export', {
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
        downloadFile(res.data, `${data.resource}.${data.format}`);
        return res;
      });
  });
};
