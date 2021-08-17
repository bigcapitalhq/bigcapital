import React from 'react';
import { Spinner } from '@blueprintjs/core';

/**
 * Previews the pdf document of the given object url.
 */
export function PdfDocumentPreview({ url, height, width, isLoading }) {
  return isLoading ? (
    <Spinner size={30} />
  ) : (
    <embed src={url} height={height} width={width} />
  );
}
