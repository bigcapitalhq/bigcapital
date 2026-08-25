import { Intent, Button, Classes } from '@blueprintjs/core';
import { useFormikContext } from 'formik';
import React from 'react';
import { useBranchActivateContext } from './BranchActivateFormProvider';
import type { WithDialogActionsProps } from '@/containers/Dialog/withDialogActions';
import { FormattedMessage as T } from '@/components';
import { withDialogActions } from '@/containers/Dialog/withDialogActions';
import { compose } from '@/utils';

interface BranchActivateFormFloatingActionsProps
  extends WithDialogActionsProps {}

/**
 * branch activate  form floating actions.
 */
function BranchActivateFormFloatingActionsInner({
  closeDialog,
}: BranchActivateFormFloatingActionsProps): React.ReactElement {
  // branch activate dialog context.
  const { dialogName } = useBranchActivateContext();

  // Formik context.
  const { isSubmitting } = useFormikContext<Record<string, never>>();

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
          <T id={'branches.activate_button'} />
        </Button>
      </div>
    </div>
  );
}

export const BranchActivateFormFloatingActions = compose(withDialogActions)(
  BranchActivateFormFloatingActionsInner,
);
