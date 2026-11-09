import classNames from 'classnames';
import React from 'react';

type ColWidth = number | string;
type BreakpointValue = ColWidth | { cols: ColWidth };

const DEVICE_SIZES = ['xl', 'lg', 'md', 'sm', 'xs'] as const;

type BreakpointProps = {
  xs?: BreakpointValue;
  sm?: BreakpointValue;
  md?: BreakpointValue;
  lg?: BreakpointValue;
  xl?: BreakpointValue;
};

export type RowProps = BreakpointProps & {
  bsPrefix?: string;
  noGutters?: boolean;
  as?: React.ElementType;
  className?: string;
} & Omit<React.HTMLAttributes<HTMLElement>, keyof BreakpointProps>;

export function Row({
  bsPrefix,
  className,
  noGutters = false,
  as: Component = 'div',
  xs,
  sm,
  md,
  lg,
  xl,
  ...props
}: RowProps) {
  const decoratedBsPrefix = 'row';
  const sizePrefix = `${decoratedBsPrefix}-cols`;
  const classes: string[] = [];

  const breakpoints: Record<string, BreakpointValue | undefined> = {
    xl,
    lg,
    md,
    sm,
    xs,
  };

  DEVICE_SIZES.forEach((brkPoint) => {
    const propValue = breakpoints[brkPoint];

    let cols: ColWidth | undefined;
    if (propValue != null && typeof propValue === 'object') {
      ({ cols } = propValue);
    } else {
      cols = propValue;
    }

    const infix = brkPoint !== 'xs' ? `-${brkPoint}` : '';

    if (cols != null) classes.push(`${sizePrefix}${infix}-${cols}`);
  });

  return (
    <Component
      {...props}
      className={classNames(
        className,
        decoratedBsPrefix,
        noGutters && 'no-gutters',
        ...classes,
      )}
    />
  );
}
