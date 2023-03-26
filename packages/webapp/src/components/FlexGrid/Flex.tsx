// @ts-nocheck
import * as React from 'react';
import { FlexProps } from './interfaces';
import { FlexItem } from './FlexItem';
import { FlexStyled } from './Flex.style';

export function Flex({
  children,
  col = 12,
  gap,
  align,
  className,
  style,
}: FlexProps) {
  return (
    <FlexStyled
      col={col}
      gap={gap}
      align={align}
      className={className}
      style={style}
    >
      {children}
      <FlexItem col={col} gap={gap} />
    </FlexStyled>
  );
}
