import { useMutation } from '@tanstack/react-query';
import useApiRequest from './useRequest';
import type { AxiosRequestConfig } from 'axios';

interface IArgs {
  url: string;
  filename: string;
  mime?: string;
  config?: AxiosRequestConfig;
  onDownloadProgress?: (progress: number) => void;
}

export const useDownloadFile = (args: IArgs) => {
  const apiRequest = useApiRequest();

  const mutation = useMutation({
    mutationFn: () =>
      apiRequest
        .get(args.url, {
          responseType: 'blob',
          onDownloadProgress: (ev) => {
            args.onDownloadProgress &&
              args.onDownloadProgress(
                Math.round((ev.loaded * 100) / (ev.total ?? 0)),
              );
          },
          ...args.config,
        })
        .then((res) => {
          downloadFile(res.data, args.filename, args.mime);
          return res;
        }),
  });
  return { ...mutation };
};

export function downloadFile(
  data: BlobPart,
  filename: string,
  mime = 'application/octet-stream',
  bom?: BlobPart,
) {
  const blobData: BlobPart[] =
    typeof bom !== 'undefined' ? [bom, data] : [data];
  const blob = new Blob(blobData, { type: mime });

  if (
    typeof (window.navigator as Navigator & { msSaveBlob?: unknown })
      .msSaveBlob !== 'undefined'
  ) {
    // IE workaround for "HTML7007: One or more blob URLs were
    // revoked by closing the blob for which they were created.
    // These URLs will no longer resolve as the data backing
    // the URL has been freed."
    (
      window.navigator as unknown as {
        msSaveBlob: (blob: Blob, name: string) => void;
      }
    ).msSaveBlob(blob, filename);
  } else {
    const blobURL =
      window.URL && window.URL.createObjectURL
        ? window.URL.createObjectURL(blob)
        : window.webkitURL.createObjectURL(blob);
    const tempLink = document.createElement('a');
    tempLink.style.display = 'none';
    tempLink.href = blobURL;
    tempLink.setAttribute('download', filename);

    // Safari thinks _blank anchor are pop ups. We only want to set _blank
    // target if the browser does not support the HTML5 download attribute.
    // This allows you to download files in desktop safari if pop up blocking
    // is enabled.
    if (typeof tempLink.download === 'undefined') {
      tempLink.setAttribute('target', '_blank');
    }

    document.body.appendChild(tempLink);
    tempLink.click();

    // Fixes "webkit blob resource error 1"
    setTimeout(function () {
      document.body.removeChild(tempLink);
      window.URL.revokeObjectURL(blobURL);
    }, 200);
  }
}
