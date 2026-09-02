import React from 'react';
import type { PdfDocument } from '@bigcapital/sdk-ts';

/**
 * Fetches a PDF document via the given SDK fetch function and exposes it as
 * an object URL for previewing. Replaces the legacy axios-based
 * `useRequestPdf` hook while keeping the same state machine.
 */
export const usePdfDocument = (fetchFn: () => Promise<PdfDocument>) => {
  const [isLoading, setIsLoading] = React.useState(false);
  const [isLoaded, setIsLoaded] = React.useState(false);
  const [isError, setIsError] = React.useState(false);
  const [pdfUrl, setPdfUrl] = React.useState('');
  const [filename, setFilename] = React.useState('');

  React.useEffect(() => {
    let isCancelled = false;
    setIsLoading(true);
    setIsError(false);

    fetchFn()
      .then((document) => {
        if (isCancelled) {
          return;
        }
        // Build a URL from the PDF blob.
        setPdfUrl(URL.createObjectURL(document.blob));
        setFilename(document.filename);
        setIsLoading(false);
        setIsLoaded(true);
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
    // `fetchFn` identity changes every render; the fetch runs once on mount,
    // matching the previous `useRequestPdf` behavior.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    isLoading,
    isLoaded,
    isError,
    pdfUrl,
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
