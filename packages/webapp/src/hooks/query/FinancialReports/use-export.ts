import { fetchExportResource } from '@bigcapital/sdk-ts';
import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { downloadFile } from '@/hooks/useDownloadFile';
import { useApiFetcher } from '@/hooks/useRequest';

interface ResourceExportValues {
  resource: string;
  format: string;
}

/**
 * Initiates a download of the given resource in CSV or XLSX format.
 * @param {Object} data - The export resource values.
 * @returns {Function} A function to trigger the file download.
 */
export const useResourceExport = () => {
  const fetcher = useApiFetcher();

  return useMutation<Blob, AxiosError, ResourceExportValues>({
    mutationFn: (data: ResourceExportValues) => {
      return fetchExportResource(fetcher, {
        resource: data.resource,
        format: data.format as 'csv' | 'xlsx',
      }).then((blob) => {
        downloadFile(blob, `${data.resource}.${data.format}`);
        return blob;
      });
    },
  });
};
