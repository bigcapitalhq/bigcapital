// @ts-nocheck
import React from 'react';
import { useFormikContext } from 'formik';
import { Intent, Button, Classes } from '@blueprintjs/core';
import { FormattedMessage as T } from 'components';
import { useProjectFormContext } from './ProjectFormProvider';
import withDialogActions from 'containers/Dialog/withDialogActions';
import { compose } from 'utils';

/**
 * Project form floating actions.
 * @returns
 */
function ProjectFormFloatingActions({
  // #withDialogActions
  closeDialog,
}) {
  // project form dialog context.
  const { dialogName } = useProjectFormContext();

  // Formik context.
  const { isSubmitting } = useFormikContext();

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
          style={{ minWidth: '75px' }}
          type="submit"
        >
          Create
        </Button>
      </div>
    </div>
  );
}

export default compose(withDialogActions)(ProjectFormFloatingActions);
