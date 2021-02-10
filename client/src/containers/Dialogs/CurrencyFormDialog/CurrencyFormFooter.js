import React from 'react';
import { useFormikContext } from 'formik';
import { useCurrencyFormContext } from './CurrencyFormProvider';

import { Button, Classes, Intent } from '@blueprintjs/core';
import { FormattedMessage as T } from 'react-intl';

import withDialogActions from 'containers/Dialog/withDialogActions';
import { compose } from 'utils';

function CurrencyFormFooter({
  // #withDialogActions
  closeDialog,
}) {
  const { isSubmitting } = useFormikContext();

  const { dialogName, isEditMode } = useCurrencyFormContext();

  const handleClose = () => {
    closeDialog(dialogName);
  };

  return (
    <div className={Classes.DIALOG_FOOTER}>
      <div className={Classes.DIALOG_FOOTER_ACTIONS}>
        <Button onClick={handleClose}>
          <T id={'cancel'} />
        </Button>
        <Button intent={Intent.PRIMARY} type="submit" disabled={isSubmitting}>
          {!isEditMode ? <T id={'submit'} /> : <T id={'edit'} />}
        </Button>
      </div>
    </div>
  );
}

export default compose(withDialogActions)(CurrencyFormFooter);
