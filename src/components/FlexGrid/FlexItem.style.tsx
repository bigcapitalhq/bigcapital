// @ts-nocheck
import styled from 'styled-components';
import { ItemProps } from './interfaces';

export const FlexItem = styled.div<ItemProps>`
  width: 100%;
  max-width: ${({ col, gap = 1 }) =>
    col && col < 12 ? `${(100 * col) / 12 - gap}%` : '100%'};
  ${({ marginBottom }) =>
    marginBottom &&
    `
		margin-bottom: ${marginBottom}px;
	`}
  ${({ stretch }) =>
    stretch &&
    `
    display: flex;
    align-self: stretch;
  `}
`;
