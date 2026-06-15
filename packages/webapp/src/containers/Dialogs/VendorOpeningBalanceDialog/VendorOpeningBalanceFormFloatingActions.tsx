// @ts-nocheck
import React from 'react';
import { Intent, Button, Classes } from '@blueprintjs/core';
import { useFormikContext } from 'formik';
import { FormattedMessage as T } from '@/components';

import { useVendorOpeningBalanceContext } from './VendorOpeningBalanceFormProvider';
import { withDialogActions } from '@/containers/Dialog/withDialogActions';
import { flow } from 'fp-ts/function';

/**
 * Vendor Opening balance floating actions.
 * @returns
 */
function VendorOpeningBalanceFormFloatingActionsInner({
  // #withDialogActions
  closeDialog,
}) {
  // dialog context.
  const { dialogName } = useVendorOpeningBalanceContext();

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
          style={{ minWidth: '75px' }}
          type="submit"
        >
          {<T id={'edit'} />}
        </Button>
        <Button onClick={handleCancelBtnClick} style={{ minWidth: '75px' }}>
          <T id={'cancel'} />
        </Button>
      </div>
    </div>
  );
}
export const VendorOpeningBalanceFormFloatingActions = flow(
  withDialogActions,
)(VendorOpeningBalanceFormFloatingActionsInner);
