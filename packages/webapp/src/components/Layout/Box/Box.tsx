import React from 'react';
import { HTMLDivProps, Props } from '@blueprintjs/core';

export interface BoxProps extends Props, HTMLDivProps {
  className?: string;
}

export function Box({ className, ...rest }: BoxProps) {
  const Element = 'div';

  return <Element className={className} {...rest} />;
}
