// @ts-nocheck
import React from 'react';
import { useFormikContext } from 'formik';
import { Intent, Button } from '@blueprintjs/core';

import {
  DialogFooter,
  DialogFooterActions,
  FormattedMessage as T,
} from '@/components';

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
    <DialogFooter>
      <DialogFooterActions alignment={'left'}>
        <Button
          intent={Intent.PRIMARY}
          loading={isSubmitting}
          style={{ minWidth: '110px' }}
          type="submit"
        >
          <T id={'send_sms'} />
        </Button>
        <Button
          disabled={isSubmitting}
          onClick={handleCancelBtnClick}
          style={{ minWidth: '75px' }}
        >
          <T id={'cancel'} />
        </Button>
      </DialogFooterActions>
    </DialogFooter>
  );
}
