// @ts-nocheck
import React from 'react';
import clsx from 'classnames';

export function Paragraph({ className, children }) {
  return <p className={clsx('paragraph', className)}>{children}</p>;
}