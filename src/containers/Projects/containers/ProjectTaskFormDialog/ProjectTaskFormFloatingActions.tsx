// @ts-nocheck
import React from 'react';
import { useFormikContext } from 'formik';
import { Intent, Button, Classes } from '@blueprintjs/core';
import { FormattedMessage as T } from '@/components';
import { useProjectTaskFormContext } from './ProjectTaskFormProvider';
import withDialogActions from '@/containers/Dialog/withDialogActions';
import { compose } from '@/utils';

/**
 * Task form floating actions.
 * @returns
 */
function ProjectTaskFormFloatingActions({
  // #withDialogActions
  closeDialog,
}) {
  // Formik context.
  const { isSubmitting } = useFormikContext();

  // Task form dialog context.
  const { dialogName } = useProjectTaskFormContext();

  // Handle close button click.
  const handleCancelBtnClick = () => {
    closeDialog(dialogName);
  };

  return (
    <div className={Classes.DIALOG_FOOTER}>
      <div className={Classes.DIALOG_FOOTER_ACTIONS}>
        <Button onClick={handleCancelBtnClick} style={{ minWidth: '75px' }}>
          <T id={'cancel'} />
        </Button>
        <Button
          intent={Intent.PRIMARY}
          loading={isSubmitting}
          style={{ minWidth: '85px' }}
          type="submit"
        >
          {<T id={'save'} />}
        </Button>
      </div>
    </div>
  );
}

export default compose(withDialogActions)(ProjectTaskFormFloatingActions);
