// @ts-nocheck
import axios, { AxiosError, AxiosRequestConfig } from 'axios';
import { useState } from 'react';
import { useMutation } from 'react-query';
import useApiRequest from './useRequest';

interface IArgs {
  url: string;
  filename: string;
  mime?: string;
  config?: AxiosRequestConfig;
  onDownloadProgress?: (progress: number) => void;
}

export const useDownloadFile = (args: IArgs) => {
  const apiRequest = useApiRequest();

  const mutation = useMutation<void, AxiosError, IArgs>(() =>
    apiRequest
      .get(args.url, {
        responseType: 'blob',
        onDownloadProgress: (ev) => {
          args.onDownloadProgress &&
            args.onDownloadProgress(Math.round((ev.loaded * 100) / ev.total));
        },
        ...args.config,
      })
      .then((res) => {
        downloadFile(res.data, args.filename, args.mime);
        return res;
      }),
  );
  return { ...mutation };
};

export function downloadFile(data, filename, mime, bom) {
  var blobData = typeof bom !== 'undefined' ? [bom, data] : [data];
  var blob = new Blob(blobData, { type: mime || 'application/octet-stream' });
  if (typeof window.navigator.msSaveBlob !== 'undefined') {
    // IE workaround for "HTML7007: One or more blob URLs were
    // revoked by closing the blob for which they were created.
    // These URLs will no longer resolve as the data backing
    // the URL has been freed."
    window.navigator.msSaveBlob(blob, filename);
  } else {
    var blobURL =
      window.URL && window.URL.createObjectURL
        ? window.URL.createObjectURL(blob)
        : window.webkitURL.createObjectURL(blob);
    var tempLink = document.createElement('a');
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
