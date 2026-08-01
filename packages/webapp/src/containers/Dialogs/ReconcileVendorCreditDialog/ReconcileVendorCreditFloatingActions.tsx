import { Intent, Button, Classes } from '@blueprintjs/core';
import { useFormikContext } from 'formik';
import React from 'react';
import { useReconcileVendorCreditContext } from './ReconcileVendorCreditFormProvider';
import type { ReconcileVendorCreditFormValues } from './types';
import type { WithDialogActionsProps } from '@/containers/Dialog/withDialogActions';
import { FormattedMessage as T } from '@/components';
import { withDialogActions } from '@/containers/Dialog/withDialogActions';
import { compose } from '@/utils';

interface ReconcileVendorCreditFloatingActionsProps
  extends WithDialogActionsProps {}

function ReconcileVendorCreditFloatingActionsInner({
  closeDialog,
}: ReconcileVendorCreditFloatingActionsProps): React.ReactElement {
  // Formik context.
  const { isSubmitting } = useFormikContext<ReconcileVendorCreditFormValues>();
  const { dialogName } = useReconcileVendorCreditContext();

  // Handle cancel button click.
  const handleCancelBtnClick = () => {
    closeDialog(dialogName);
  };

  return (
    <div className={Classes.DIALOG_FOOTER}>
      <div className={Classes.DIALOG_FOOTER_ACTIONS}>
        <Button
          intent={Intent.PRIMARY}
          style={{ minWidth: '95px' }}
          type="submit"
          loading={isSubmitting}
        >
          <T id={'save'} />
        </Button>
        <Button onClick={handleCancelBtnClick} style={{ minWidth: '85px' }}>
          <T id={'cancel'} />
        </Button>
      </div>
    </div>
  );
}
export const ReconcileVendorCreditFloatingActions = compose(withDialogActions)(
  ReconcileVendorCreditFloatingActionsInner,
);
