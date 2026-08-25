import { Intent, Button, Classes } from '@blueprintjs/core';
import { useFormikContext } from 'formik';
import React from 'react';
import { useBranchFormContext } from './BranchFormProvider';
import type { BranchFormValues } from './types';
import type { WithDialogActionsProps } from '@/containers/Dialog/withDialogActions';
import { FormattedMessage as T } from '@/components';
import { withDialogActions } from '@/containers/Dialog/withDialogActions';
import { compose } from '@/utils';

interface BranchFormFloatingActionsProps extends WithDialogActionsProps {}

/**
 * Branch form floating actions.
 */
function BranchFormFloatingActionsInner({
  closeDialog,
}: BranchFormFloatingActionsProps): React.ReactElement {
  // Formik context.
  const { isSubmitting } = useFormikContext<BranchFormValues>();
  const { dialogName } = useBranchFormContext();

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
          <T id={'save'} />
        </Button>
      </div>
    </div>
  );
}
export const BranchFormFloatingActions = compose(withDialogActions)(
  BranchFormFloatingActionsInner,
);
