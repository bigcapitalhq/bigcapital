import React from 'react';
import { useFormikContext } from 'formik';
import { Intent, Button, Classes } from '@blueprintjs/core';
import styled from 'styled-components';

import { FormattedMessage as T } from 'components';

import { safeCallback } from 'utils';

/**
 *
 */
export default function NotifyViaSMSFormFloatingActions({ onCancel }) {
  // Formik context.
  const { isSubmitting } = useFormikContext();

  // Handle close button click.
  const handleCancelBtnClick = (event) => {
    onCancel && onCancel(event);
  };

  return (
    <div className={Classes.DIALOG_FOOTER}>
      <FooterActions className={Classes.DIALOG_FOOTER_ACTIONS}>
        <Button
          intent={Intent.PRIMARY}
          loading={isSubmitting}
          style={{ minWidth: '110px' }}
          type="submit"
        >
          Send SMS
        </Button>
        <Button
          disabled={isSubmitting}
          onClick={handleCancelBtnClick}
          style={{ minWidth: '75px' }}
        >
          <T id={'cancel'} />
        </Button>
      </FooterActions>
    </div>
  );
}

const FooterActions = styled.div`
  justify-content: flex-start;
`;
