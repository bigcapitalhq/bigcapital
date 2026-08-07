// @ts-nocheck
import clsx from 'classnames';
import React from 'react';

export function Paragraph({ className, children }) {
  return <p className={clsx('paragraph', className)}>{children}</p>;
}
