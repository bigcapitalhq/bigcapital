// @ts-nocheck
import styled from 'styled-components';
import { FlexProps } from './interfaces';

export const FlexStyled = styled.div<FlexProps>`
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  align-items: ${({ align }) => align || 'center'};

  &:after {
    content: '';
    max-width: ${({ col, gap = 1 }) =>
      col && col < 12 ? `${(100 * col) / 12 - gap}%` : '100%'};
    width: 100%;
  }
`;
