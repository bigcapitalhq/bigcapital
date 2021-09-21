import React from 'react';
import { Intent, Button, Classes } from '@blueprintjs/core';
import { FormattedMessage as T } from 'components';

import { useFormikContext } from 'formik';
import { useAllocateLandedConstDialogContext } from './AllocateLandedCostDialogProvider';
import withDialogActions from 'containers/Dialog/withDialogActions';
import { compose } from 'utils';

function AllocateLandedCostFloatingActions({
  // #withDialogActions
  closeDialog,
}) {
  // Formik context.
  const { isSubmitting } = useFormikContext();
  const { dialogName } = useAllocateLandedConstDialogContext();

  // Handle cancel button click.
  const handleCancelBtnClick = (event) => {
    closeDialog(dialogName);
  };

  return (
    <div className={Classes.DIALOG_FOOTER}>
      <div className={Classes.DIALOG_FOOTER_ACTIONS}>
        <Button onClick={handleCancelBtnClick} style={{ minWidth: '85px' }}>
          <T id={'cancel'} />
        </Button>
        <Button
          intent={Intent.PRIMARY}
          style={{ minWidth: '85px' }}
          type="submit"
          loading={isSubmitting}
        >
          {<T id={'save'} />}
        </Button>
      </div>
    </div>
  );
}

export default compose(withDialogActions)(AllocateLandedCostFloatingActions);
