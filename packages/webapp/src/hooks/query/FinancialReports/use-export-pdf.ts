// @ts-nocheck
import { downloadFile } from '@/hooks/useDownloadFile';
import useApiRequest from '@/hooks/useRequest';
import { AxiosError } from 'axios';
import { useMutation } from 'react-query';
import { asyncToastProgress } from '@/utils/async-toast-progress';

interface ResourceExportValues {
  resource: string;
}
/**
 * Initiates a download of the balance sheet in XLSX format.
 * @param {Object} query - The query parameters for the request.
 * @param {Object} args - Additional configurations for the download.
 * @returns {Function} A function to trigger the file download.
 */
export const useResourceExportPdf = (props) => {
  const apiRequest = useApiRequest();

  return useMutation<void, AxiosError, any>((data: ResourceExportValues) => {
    return apiRequest.get(
      '/export',
      {
        responseType: 'blob',
        headers: {
          accept: 'application/pdf',
        },
        params: {
          resource: data.resource,
          format: data.format,
        },
      },
      props,
    );
  });
};

export const useDownloadExportPdf = () => {
  const { startProgress, stopProgress } = asyncToastProgress();

  const resourceExportPdfMutation = useResourceExportPdf({
    onMutate: () => {},
  });
  const { mutateAsync, isLoading: isExportPdfLoading } =
    resourceExportPdfMutation;

  const downloadAsync = (values) => {
    if (!isExportPdfLoading) {
      startProgress();
      return mutateAsync(values).then((res) => {
        downloadFile(res.data, `${values.resource}.pdf`);
        stopProgress();

        return res;
      });
    }
  };
  return {
    ...resourceExportPdfMutation,
    downloadAsync,
  };
};
