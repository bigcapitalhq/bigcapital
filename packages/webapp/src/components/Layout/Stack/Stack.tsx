import React from 'react';
import styled from 'styled-components';
import { Box } from '../Box';

export interface StackProps extends React.ComponentPropsWithoutRef<'div'> {
  /** Key of theme.spacing or number to set gap in px */
  spacing?: number;

  /** align-items CSS property */
  align?: React.CSSProperties['alignItems'];

  /** justify-content CSS property */
  justify?: React.CSSProperties['justifyContent'];

  flex?: React.CSSProperties['flex'];
}

const defaultProps: Partial<StackProps> = {
  spacing: 20,
  align: 'stretch',
  justify: 'top',
  flex: 'none',
};

export function Stack(props: StackProps) {
  const stackProps = {
    ...defaultProps,
    ...props,
  };
  return <StackStyled {...stackProps} />;
}

const StackStyled = styled(Box)`
  display: flex;
  flex-direction: column;
  align-items: ${(props: StackProps) => props.align};
  justify-content: justify;
  gap: ${(props: StackProps) => props.spacing}px;
  flex: ${(props: StackProps) => props.flex};
`;
