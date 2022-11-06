// @ts-nocheck
import React from 'react';
import { Intent, Button, Classes } from '@blueprintjs/core';
import { useFormikContext } from 'formik';
import { FormattedMessage as T } from '@/components';

import { useBranchActivateContext } from './BranchActivateFormProvider';
import withDialogActions from '@/containers/Dialog/withDialogActions';
import { compose } from '@/utils';

/**
 * branch activate  form floating actions.
 */
function BranchActivateFormFloatingActions({
  // #withDialogActions
  closeDialog,
}) {
  // branch activate dialog context.
  const { dialogName } = useBranchActivateContext();

  // Formik context.
  const { isSubmitting } = useFormikContext();

  // Handle close button click.
  const handleCancelBtnClick = () => {
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
          loading={isSubmitting}
          style={{ minWidth: '95px' }}
          type="submit"
        >
          {<T id={'branches.activate_button'} />}
          
        </Button>
      </div>
    </div>
  );
}

export default compose(withDialogActions)(BranchActivateFormFloatingActions);
