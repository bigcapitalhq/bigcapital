import { fetchExportResource } from '@bigcapital/sdk-ts';
import { useMutation } from '@tanstack/react-query';
import { downloadFile } from '@/hooks/useDownloadFile';
import { useApiFetcher } from '@/hooks/useRequest';
import { asyncToastProgress } from '@/utils/async-toast-progress';

interface ResourceExportValues {
  resource: string;
  format?: string;
}

/**
 * Initiates a download of the given resource in PDF format.
 * @param {Object} data - The export resource values.
 * @returns {Function} A function to trigger the file download.
 */
export const useResourceExportPdf = () => {
  const fetcher = useApiFetcher();

  return useMutation<Blob, Error, ResourceExportValues>({
    mutationFn: (data: ResourceExportValues) => {
      return fetchExportResource(fetcher, {
        resource: data.resource,
        format: (data.format ?? 'pdf') as 'csv' | 'xlsx' | 'pdf',
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
        .then((blob) => {
          downloadFile(blob, `${values.resource}.pdf`);
          stopProgress();

          return blob;
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
