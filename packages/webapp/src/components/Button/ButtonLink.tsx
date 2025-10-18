// @ts-nocheck
import styled from 'styled-components';

export const ButtonLink = styled.button`
  color: var(--color-primary);
  border: 0;
  background: transparent;
  cursor: pointer;
  text-align: inherit;

  &:hover,
  &:active {
    text-decoration: underline;
  }
`;
