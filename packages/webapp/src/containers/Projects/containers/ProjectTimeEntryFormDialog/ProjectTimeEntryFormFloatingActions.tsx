// @ts-nocheck
import { Intent, Button, Classes } from '@blueprintjs/core';
import { useFormikContext } from 'formik';
import React from 'react';
import { useProjectTimeEntryFormContext } from './ProjectTimeEntryFormProvider';
import { FormattedMessage as T } from '@/components';
import { withDialogActions } from '@/containers/Dialog/withDialogActions';
import { compose } from '@/utils';

/**
 * Projcet time entry form floating actions.
 * @returns
 */
function ProjectTimeEntryFormFloatingActionsInner({
  // #withDialogActions
  closeDialog,
}) {
  // time entry form dialog context.
  const { dialogName } = useProjectTimeEntryFormContext();

  // Formik context.
  const { isSubmitting } = useFormikContext();

  // Handle close button click.
  const handleCancelBtnClick = () => {
    closeDialog(dialogName);
  };

  return (
    <div className={Classes.DIALOG_FOOTER}>
      <div className={Classes.DIALOG_FOOTER_ACTIONS}>
        <Button
          intent={Intent.PRIMARY}
          loading={isSubmitting}
          style={{ minWidth: '95px' }}
          type="submit"
        >
          <T id={'project_time_entry.dialog.create'} />
        </Button>
      </div>
    </div>
  );
}

export const ProjectTimeEntryFormFloatingActions = compose(withDialogActions)(
  ProjectTimeEntryFormFloatingActionsInner,
);
