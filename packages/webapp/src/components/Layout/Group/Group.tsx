import React from 'react';
import { SystemProps } from '@xstyled/emotion';
import { Box } from '../Box';
import { filterFalsyChildren } from './_utils';

export type GroupPosition = 'right' | 'center' | 'left' | 'apart';

export const GROUP_POSITIONS = {
  left: 'flex-start',
  center: 'center',
  right: 'flex-end',
  apart: 'space-between',
};

export interface GroupProps
  extends SystemProps,
    Omit<React.ComponentPropsWithoutRef<'div'>, 'color'> {
  /** Defines justify-content property */
  position?: GroupPosition;

  /** Defined flex-wrap property */
  noWrap?: boolean;

  /** Defines flex-grow property for each element, true -> 1, false -> 0 */
  grow?: boolean;

  /** Space between elements */
  spacing?: number;

  /** Defines align-items css property */
  align?: React.CSSProperties['alignItems'];
}

export function Group({
  position = 'left',
  spacing = 20,
  align = 'center',
  noWrap,
  children,
  ...props
}: GroupProps) {
  const filteredChildren = filterFalsyChildren(children);

  return (
    <Box
      boxSizing={'border-box'}
      display={'flex'}
      flexDirection={'row'}
      alignItems={align}
      flexWrap={noWrap ? 'nowrap' : 'wrap'}
      justifyContent={GROUP_POSITIONS[position]}
      gap={`${spacing}px`}
      {...props}
    >
      {filteredChildren}
    </Box>
  );
}
