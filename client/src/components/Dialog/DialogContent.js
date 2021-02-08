import React from 'react';
import { Spinner, Classes } from '@blueprintjs/core';
import classNames from 'classnames';

export default function DialogContent(props) {
  const { isLoading, children } = props;

  const loadingContent = (
    <div
      className={classNames(Classes.DIALOG_BODY, {
        'is-loading': isLoading,
      })}
    >
      <Spinner size={30} />
    </div>
  );
  return <div>{isLoading ? loadingContent : children}</div>;
}
