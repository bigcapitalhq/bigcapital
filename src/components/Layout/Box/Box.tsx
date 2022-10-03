import React from 'react';

export interface BoxProps {
  className?: string;
}

export function Box({ className, ...rest }: BoxProps) {
  const Element = 'div';

  return <Element className={className} {...rest} />;
}
