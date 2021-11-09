import React from 'react';
import { Intent, Button, Classes } from '@blueprintjs/core';
import { useFormikContext } from 'formik';

import { DialogFooterActions, FormattedMessage as T } from 'components';

import { useSMSMessageDialogContext } from './SMSMessageDialogProvider';
import withDialogActions from 'containers/Dialog/withDialogActions';

import { compose } from 'utils';

/**
 * SMS Message Form floating actions.
 */
function SMSMessageFormFloatingActions({
  // #withDialogActions
  closeDialog,
}) {
  // Formik context.
  const { isSubmitting } = useFormikContext();

  // SMS Message dialog contxt.
  const { dialogName } = useSMSMessageDialogContext();

  // Handle close button click.
  const handleCancelBtnClick = () => {
    closeDialog(dialogName);
  };

  return (
    <div className={Classes.DIALOG_FOOTER}>
      <DialogFooterActions alignment={'left'}>
        <Button onClick={handleCancelBtnClick} style={{ minWidth: '75px' }}>
          <T id={'cancel'} />
        </Button>
        <Button
          intent={Intent.PRIMARY}
          loading={isSubmitting}
          style={{ minWidth: '75px' }}
          type="submit"
        >
          Save SMS Message
        </Button>
      </DialogFooterActions>
    </div>
  );
}

export default compose(withDialogActions)(SMSMessageFormFloatingActions);
