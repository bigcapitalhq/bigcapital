import { css } from '@emotion/css';
import { Theme } from '@xstyled/emotion';

/**
 * Shared fields style of the manual/recurring journal forms.
 * @param {Theme} theme
 * @returns {string}
 */
export const getMakeJournalFieldsStyle = (theme: Theme) => css`
  .${theme.bpPrefix}-form-group {
    margin-bottom: 0;

    &.${theme.bpPrefix}-inline {
      max-width: 480px;
    }
    .${theme.bpPrefix}-label {
      min-width: 165px;
      font-weight: 500;
    }
    .${theme.bpPrefix}-form-content {
      width: 100%;
    }
  }
`;
