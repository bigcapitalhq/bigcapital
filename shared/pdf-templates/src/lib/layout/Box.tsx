import React, { forwardRef, Ref } from 'react';
import { SystemProps, x } from '@xstyled/emotion';

interface IProps {
  className?: string;
}
export interface BoxProps
  extends SystemProps,
  IProps,
  Omit<React.HTMLProps<HTMLDivElement>, 'color' | 'as'> { }

export const Box = forwardRef(
  ({ className, ...rest }: BoxProps, ref: Ref<HTMLDivElement>) => {
    const Element = x.div;

    return <Element className={className} ref={ref} {...rest} />;
  },
);
Box.displayName = '@bigcapital/Box';
