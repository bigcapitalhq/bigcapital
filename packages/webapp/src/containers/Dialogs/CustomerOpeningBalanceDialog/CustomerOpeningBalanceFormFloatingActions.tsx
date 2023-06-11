// @ts-nocheck
import React from 'react';
import { Intent, Button, Classes } from '@blueprintjs/core';
import { useFormikContext } from 'formik';
import { FormattedMessage as T } from '@/components';

import { useCustomerOpeningBalanceContext } from './CustomerOpeningBalanceFormProvider';
import withDialogActions from '@/containers/Dialog/withDialogActions';
import { compose } from '@/utils';

/**
 * Customer Opening balance floating actions.
 * @returns
 */
function CustomerOpeningBalanceFormFloatingActions({
  // #withDialogActions
  closeDialog,
}) {
  // dialog context.
  const { dialogName } = useCustomerOpeningBalanceContext();

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
          {<T id={'edit'} />}
        </Button>
      </div>
    </div>
  );
}
export default compose(withDialogActions)(
  CustomerOpeningBalanceFormFloatingActions,
);
