// @ts-nocheck
import { Intent, Button, Classes } from '@blueprintjs/core';
import { useFormikContext } from 'formik';
import React from 'react';
import { useProjectFormContext } from './ProjectFormProvider';
import { FormattedMessage as T } from '@/components';
import { withDialogActions } from '@/containers/Dialog/withDialogActions';
import { compose } from '@/utils';

/**
 * Project form floating actions.
 * @returns
 */
function ProjectFormFloatingActionsInner({
  // #withDialogActions
  closeDialog,
}) {
  // Formik context.
  const { isSubmitting } = useFormikContext();

  return (
    <div className={Classes.DIALOG_FOOTER}>
      <div className={Classes.DIALOG_FOOTER_ACTIONS}>
        <Button
          intent={Intent.PRIMARY}
          loading={isSubmitting}
          style={{ minWidth: '100px' }}
          type="submit"
        >
          <T id={'projects.label.create'} />
        </Button>
      </div>
    </div>
  );
}

export const ProjectFormFloatingActions = compose(withDialogActions)(
  ProjectFormFloatingActionsInner,
);
