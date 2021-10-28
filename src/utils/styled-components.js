import { css } from 'styled-components';

export const whenRtl = (restCss) => css`
  ${({ theme }) => theme.dir === 'rtl' && restCss}
`;

export const whenLtr = (restCss) => css`
  ${({ theme }) => !theme.dir === 'ltr' && restCss}
`;
