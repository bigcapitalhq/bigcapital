// @ts-nocheck
import React from 'react';
import useApiRequest from './useRequest';

export const useRequestPdf = (httpProps) => {
  const apiRequest = useApiRequest();
  const [isLoading, setIsLoading] = React.useState(false);
  const [isLoaded, setIsLoaded] = React.useState(false);
  const [pdfUrl, setPdfUrl] = React.useState('');
  const [response, setResponse] = React.useState(null);

  React.useEffect(() => {
    setIsLoading(true);
    apiRequest
      .http({
        headers: { accept: 'application/pdf' },
        responseType: 'blob',
        ...httpProps,
        url: `/api/${httpProps?.url}`,
      })
      .then((response) => {
        // Create a Blob from the PDF Stream.
        const file = new Blob([response.data], { type: 'application/pdf' });

        // Build a URL from the file
        const fileURL = URL.createObjectURL(file);

        setPdfUrl(fileURL);
        setIsLoading(false);
        setIsLoaded(true);
        setResponse(response);
      });
  }, []);

  return {
    isLoading,
    isLoaded,
    pdfUrl,
    response,
  };
};
