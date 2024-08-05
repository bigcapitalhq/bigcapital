import React, { forwardRef, Ref } from 'react';
import { HTMLDivProps, Props } from '@blueprintjs/core';

export interface BoxProps extends Props, HTMLDivProps {
  className?: string;
}

export const Box = forwardRef(
  ({ className, ...rest }: BoxProps, ref: Ref<HTMLDivElement>) => {
    const Element = 'div';

    return <Element className={className} ref={ref} {...rest} />;
  },
);
Box.displayName = '@bigcapital/Box';
