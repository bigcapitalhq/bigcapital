// @ts-nocheck
import React from 'react';
import useApiRequest from './useRequest';

export const useRequestPdf = (httpProps) => {
  const apiRequest = useApiRequest();
  const [isLoading, setIsLoading] = React.useState(false);
  const [isLoaded, setIsLoaded] = React.useState(false);
  const [pdfUrl, setPdfUrl] = React.useState('');
  const [response, setResponse] = React.useState(null);
  const [filename, setFilename] = React.useState<string>('');

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

        // Extract the filename from the Content-Disposition header
        const contentDisposition = response.headers.get('Content-Disposition');
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
      });
  }, []);

  return {
    isLoading,
    isLoaded,
    pdfUrl,
    response,
    filename
  };
};
