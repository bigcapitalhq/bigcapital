import { HTMLDivProps, Props } from '@blueprintjs/core';
import { SystemProps, x } from '@xstyled/emotion';
import React, { forwardRef, Ref } from 'react';

export interface BoxProps
  extends SystemProps,
    Props,
    Omit<HTMLDivProps, 'color'> {}

export const Box = forwardRef(
  ({ className, ...rest }: BoxProps, ref: Ref<HTMLDivElement>) => {
    const Element = x.div;

    return <Element className={className} ref={ref} {...rest} />;
  },
);
Box.displayName = '@bigcapital/Box';
