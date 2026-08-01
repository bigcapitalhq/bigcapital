import { Intent, Button } from '@blueprintjs/core';
import { useFormikContext } from 'formik';
import React from 'react';
import { useSMSMessageDialogContext } from './SMSMessageDialogProvider';
import type { SMSMessageFormValues } from './types';
import type { WithDialogActionsProps } from '@/containers/Dialog/withDialogActions';
import {
  DialogFooter,
  DialogFooterActions,
  FormattedMessage as T,
} from '@/components';
import { withDialogActions } from '@/containers/Dialog/withDialogActions';
import { compose } from '@/utils';

interface SMSMessageFormFloatingActionsProps extends WithDialogActionsProps {}

/**
 * SMS Message Form floating actions.
 */
function SMSMessageFormFloatingActionsInner({
  closeDialog,
}: SMSMessageFormFloatingActionsProps): React.ReactElement {
  // Formik context.
  const { isSubmitting } = useFormikContext<SMSMessageFormValues>();

  // SMS Message dialog contxt.
  const { dialogName } = useSMSMessageDialogContext();

  // Handle close button click.
  const handleCancelBtnClick = () => {
    closeDialog(dialogName);
  };

  return (
    <DialogFooter>
      <DialogFooterActions alignment={'left'}>
        <Button
          intent={Intent.PRIMARY}
          loading={isSubmitting}
          style={{ minWidth: '75px' }}
          type="submit"
        >
          <T id={'save_sms_message'} />
        </Button>
        <Button onClick={handleCancelBtnClick} style={{ minWidth: '75px' }}>
          <T id={'cancel'} />
        </Button>
      </DialogFooterActions>
    </DialogFooter>
  );
}

export const SMSMessageFormFloatingActions = compose(withDialogActions)(
  SMSMessageFormFloatingActionsInner,
);
