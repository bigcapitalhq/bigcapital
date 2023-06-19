// @ts-nocheck
import React from 'react';
import { Intent, Button } from '@blueprintjs/core';
import { useFormikContext } from 'formik';

import {
  DialogFooter,
  DialogFooterActions,
  FormattedMessage as T,
} from '@/components';
import { useSMSMessageDialogContext } from './SMSMessageDialogProvider';
import withDialogActions from '@/containers/Dialog/withDialogActions';

import { compose } from '@/utils';

/**
 * SMS Message Form floating actions.
 */
function SMSMessageFormFloatingActions({
  // #withDialogActions
  closeDialog,
}) {
  // Formik context.
  const { isSubmitting } = useFormikContext();

  // SMS Message dialog context.
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

export default compose(withDialogActions)(SMSMessageFormFloatingActions);
