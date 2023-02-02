// @ts-nocheck
import React from 'react';
import { Spinner, Classes } from '@blueprintjs/core';
import classNames from 'classnames';

/**
 * Previews the pdf document of the given object url.
 */
export function PdfDocumentPreview({ url, height, width, isLoading }) {
  const content = isLoading ? (
    <Spinner size={30} />
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
