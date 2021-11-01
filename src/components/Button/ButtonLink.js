import styled from 'styled-components';
import { Button } from '@blueprintjs/core';

export const ButtonLink = styled(Button)`
  line-height: inherit;

  &.bp3-small {
    min-height: auto;
    min-width: auto;
    padding: 0;
  }
  &:not([class*='bp3-intent-']) {
    &,
    &:hover {
      color: #0052cc;
      background: transparent;
    }

    &:hover {
      text-decoration: underline;
    }
  }
`;
