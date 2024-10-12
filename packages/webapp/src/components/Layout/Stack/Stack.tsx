import React from 'react';
import { x, SystemProps } from '@xstyled/emotion';

export interface StackProps
  extends SystemProps,
    Omit<React.ComponentPropsWithoutRef<'div'>, 'color'> {
  /** Key of theme.spacing or number to set gap in px */
  spacing?: number;

  /** align-items CSS property */
  align?: React.CSSProperties['alignItems'];

  /** justify-content CSS property */
  justify?: React.CSSProperties['justifyContent'];
}

export function Stack({
  spacing = 20,
  align = 'stretch',
  justify = 'top',
  ...restProps
}: StackProps) {
  return (
    <x.div
      display={'flex'}
      flexDirection="column"
      justifyContent="justify"
      gap={`${spacing}px`}
      alignItems={align}
      {...restProps}
    />
  );
}
