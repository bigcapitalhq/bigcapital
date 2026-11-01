// @ts-nocheck
import { Spinner, Classes } from '@blueprintjs/core';
import classNames from 'classnames';
import React from 'react';

/**
 * Previews the pdf document of the given object url.
 */
export function PdfDocumentPreview({
  url,
  height,
  width,
  isLoading,
  isError = false,
}) {
  const content = isLoading ? (
    <Spinner size={30} />
  ) : isError ? (
    <div className="pdf-preview__error">
      Failed to load the PDF document. Please try again.
    </div>
  ) : (
    <embed src={url} height={height} width={width} />
  );

  return (
    <div
      className={classNames(Classes.DIALOG_BODY, {
        loading: isLoading,
      })}
    >
      {content}
    </div>
  );
}
