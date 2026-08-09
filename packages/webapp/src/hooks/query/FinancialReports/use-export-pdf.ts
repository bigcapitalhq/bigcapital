import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import type { AxiosResponse } from 'axios';
import { downloadFile } from '@/hooks/useDownloadFile';
import useApiRequest from '@/hooks/useRequest';
import { asyncToastProgress } from '@/utils/async-toast-progress';

interface ResourceExportValues {
  resource: string;
  format?: string;
}

/**
 * Initiates a download of the balance sheet in PDF format.
 * @param {Object} data - The export resource values.
 * @returns {Function} A function to trigger the file download.
 */
export const useResourceExportPdf = () => {
  const apiRequest = useApiRequest();

  return useMutation<AxiosResponse, AxiosError, ResourceExportValues>({
    mutationFn: (data: ResourceExportValues) => {
      return apiRequest.get('/export', {
        responseType: 'blob',
        headers: {
          accept: 'application/pdf',
        },
        params: {
          resource: data.resource,
          format: data.format,
        },
      });
    },
  });
};

export const useDownloadExportPdf = () => {
  const { startProgress, stopProgress } = asyncToastProgress();

  const resourceExportPdfMutation = useResourceExportPdf();
  const { mutateAsync, isPending: isExportPdfLoading } =
    resourceExportPdfMutation;

  const downloadAsync = (values: ResourceExportValues) => {
    if (!isExportPdfLoading) {
      startProgress();
      return mutateAsync(values)
        .then((res) => {
          downloadFile(res.data, `${values.resource}.pdf`);
          stopProgress();

          return res;
        })
        .catch((error) => {
          stopProgress();
          throw error;
        });
    }
    return undefined;
  };

  return {
    ...resourceExportPdfMutation,
    downloadAsync,
  };
};
