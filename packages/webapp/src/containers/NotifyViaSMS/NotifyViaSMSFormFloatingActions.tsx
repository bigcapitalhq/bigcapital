import { Intent, Button } from '@blueprintjs/core';
import { useFormikContext } from 'formik';
import React from 'react';
import {
  DialogFooter,
  DialogFooterActions,
  FormattedMessage as T,
} from '@/components';

interface NotifyViaSMSFormFloatingActionsProps {
  onCancel?: (event?: React.MouseEvent<HTMLElement>) => void;
}

export function NotifyViaSMSFormFloatingActions({
  onCancel,
}: NotifyViaSMSFormFloatingActionsProps) {
  // Formik context.
  const { isSubmitting } = useFormikContext();

  // Handle close button click.
  const handleCancelBtnClick = (event: React.MouseEvent<HTMLElement>) => {
    onCancel && onCancel(event);
  };

  return (
    <DialogFooter>
      <DialogFooterActions alignment={'left'}>
        <Button
          disabled={isSubmitting}
          onClick={handleCancelBtnClick}
          style={{ minWidth: '75px' }}
        >
          <T id={'cancel'} />
        </Button>
        <Button
          intent={Intent.PRIMARY}
          loading={isSubmitting}
          style={{ minWidth: '110px' }}
          type="submit"
        >
          <T id={'send_sms'} />
        </Button>
      </DialogFooterActions>
    </DialogFooter>
  );
}
