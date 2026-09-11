import clsx from 'classnames';
import React from 'react';
import type { ReactNode } from 'react';

export interface ParagraphProps {
  className?: string;
  children?: ReactNode;
}

export function Paragraph({ className, children }: ParagraphProps) {
  return <p className={clsx('paragraph', className)}>{children}</p>;
}
