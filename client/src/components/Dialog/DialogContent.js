import React from 'react';
import { Spinner, Classes } from '@blueprintjs/core';
import classNames from 'classnames';

export default function DialogContent(props) {
  const { isLoading, children } = props;

  const loadingContent = <Spinner size={30} />;

  return (
    <div
      className={classNames(Classes.DIALOG_BODY, {
        'is-loading': isLoading,
      })}
    >
      {isLoading ? loadingContent : children}
    </div>
  );
}
