import React from 'react';
import styled from 'styled-components';
import { Box } from '../Box';
import { filterFalsyChildren } from './_utils';

export type GroupPosition = 'right' | 'center' | 'left' | 'apart';

export const GROUP_POSITIONS = {
  left: 'flex-start',
  center: 'center',
  right: 'flex-end',
  apart: 'space-between',
};

export interface GroupProps extends React.ComponentPropsWithoutRef<'div'> {
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

const defaultProps: Partial<GroupProps> = {
  position: 'left',
  spacing: 20,
};

export function Group({ children, ...props }: GroupProps) {
  const groupProps = {
    ...defaultProps,
    ...props,
  };
  const filteredChildren = filterFalsyChildren(children);

  return <GroupStyled {...groupProps}>{filteredChildren}</GroupStyled>;
}

const GroupStyled = styled(Box)`
  box-sizing: border-box;
  display: flex;
  flex-direction: row;
  align-items: ${(props: GroupProps) => (props.align || 'center')};
  flex-wrap: ${(props: GroupProps) => (props.noWrap ? 'nowrap' : 'wrap')};
  justify-content: ${(props: GroupProps) =>
    GROUP_POSITIONS[props.position || 'left']};
  gap: ${(props: GroupProps) => props.spacing}px;
`;
