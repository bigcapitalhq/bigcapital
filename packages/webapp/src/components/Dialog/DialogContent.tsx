// @ts-nocheck
import React from 'react';
import { Spinner, Classes } from '@blueprintjs/core';
import classNames from 'classnames';

export function DialogContent(props) {
  const { isLoading, children } = props;

  const loadingContent = (
    <div className={classNames(Classes.DIALOG_BODY, 'is-loading')}>
      <Spinner size={30} />
    </div>
  );
  return isLoading ? loadingContent : children;
}
