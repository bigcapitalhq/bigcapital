import React from 'react';
import { Intent, Button } from '@blueprintjs/core';
import {
  DialogFooter,
  DialogFooterActions,
  FormattedMessage as T,
} from 'components';

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
    <DialogFooter>
      <DialogFooterActions alignment={'right'}>
        <Button onClick={handleCancelBtnClick} style={{ minWidth: '85px' }}>
          <T id={'cancel'} />
        </Button>
        <Button
          intent={Intent.PRIMARY}
          style={{ minWidth: '95px' }}
          type="submit"
          loading={isSubmitting}
        >
          {<T id={'save'} />}
        </Button>
      </DialogFooterActions>
    </DialogFooter>
  );
}

export default compose(withDialogActions)(AllocateLandedCostFloatingActions);
