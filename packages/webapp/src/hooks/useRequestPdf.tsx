import React from 'react';
import { normalizeApiPath } from '../utils';
import useApiRequest from './useRequest';
import type {
  AxiosRequestConfig,
  AxiosResponse,
  AxiosResponseHeaders,
} from 'axios';

export interface PdfRequestProps extends AxiosRequestConfig {
  url: string;
}

export const useRequestPdf = (httpProps?: PdfRequestProps) => {
  const apiRequest = useApiRequest();
  const [isLoading, setIsLoading] = React.useState(false);
  const [isLoaded, setIsLoaded] = React.useState(false);
  const [isError, setIsError] = React.useState(false);
  const [pdfUrl, setPdfUrl] = React.useState('');
  const [response, setResponse] = React.useState<AxiosResponse<Blob> | null>(
    null,
  );
  const [filename, setFilename] = React.useState<string>('');

  const url = `/api/${normalizeApiPath(httpProps?.url || '')}`;

  React.useEffect(() => {
    if (!httpProps?.url) {
      return;
    }
    let isCancelled = false;
    setIsLoading(true);
    setIsError(false);

    apiRequest
      .http({
        headers: { accept: 'application/pdf' },
        responseType: 'blob',
        ...httpProps,
        url,
      })
      .then((response) => {
        if (isCancelled) {
          return;
        }
        // Create a Blob from the PDF Stream.
        const file = new Blob([response.data], { type: 'application/pdf' });

        // Build a URL from the file
        const fileURL = URL.createObjectURL(file);

        // Extract the filename from the Content-Disposition header
        const contentDisposition = (
          response.headers as AxiosResponseHeaders
        ).get('Content-Disposition') as string | undefined;
        let _filename = 'default.pdf'; // Default filename if not provided by server

        if (contentDisposition && contentDisposition.includes('filename=')) {
          const matches = contentDisposition.match(/filename="(.+)"/);
          if (matches && matches[1]) {
            _filename = matches[1];
          }
        }
        setPdfUrl(fileURL);
        setIsLoading(false);
        setIsLoaded(true);
        setResponse(response);
        setFilename(_filename);
      })
      .catch(() => {
        if (isCancelled) {
          return;
        }
        setIsLoading(false);
        setIsLoaded(false);
        setIsError(true);
      });

    return () => {
      isCancelled = true;
    };
    // `httpProps` intentionally omitted from deps — refetching only depends on
    // the resolved URL, and callers pass a fresh object on every render.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url, apiRequest]);

  return {
    isLoading,
    isLoaded,
    isError,
    pdfUrl,
    response,
    filename,
  };
};

export const useFetcherPdf = (fetchFn: () => Promise<Blob>) => {
  const [isLoading, setIsLoading] = React.useState(false);
  const [pdfUrl, setPdfUrl] = React.useState('');

  React.useEffect(() => {
    setIsLoading(true);
    fetchFn().then((blob) => {
      setPdfUrl(URL.createObjectURL(blob));
      setIsLoading(false);
    });
  }, []);

  return { isLoading, pdfUrl };
};
