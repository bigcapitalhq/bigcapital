// @ts-nocheck
import { Intent, Button, Classes } from '@blueprintjs/core';
import { useFormikContext } from 'formik';
import React from 'react';
import { useProjectInvoicingFormContext } from './ProjectInvoicingFormProvider';
import { FormattedMessage as T } from '@/components';
import { withDialogActions } from '@/containers/Dialog/withDialogActions';
import { compose } from '@/utils';

/**
 * Project invoicing from floating actions
 * @returns
 */
function ProjectInvoicingFormFloatingActionsInner({
  // #withDialogActions
  closeDialog,
}) {
  // Formik context.
  const { isSubmitting } = useFormikContext();

  // project invoicing form dialog context.
  const { dialogName } = useProjectInvoicingFormContext();

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
          style={{ minWidth: '75px' }}
          type="submit"
        >
          <T id={'project_invoicing.label.add'} />
        </Button>
      </div>
    </div>
  );
}

export const ProjectInvoicingFormFloatingActions = compose(withDialogActions)(
  ProjectInvoicingFormFloatingActionsInner,
);
