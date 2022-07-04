import React from 'react';
import { useFormikContext } from 'formik';

import { Button, Classes, Intent } from '@blueprintjs/core';
import { FormattedMessage as T } from '@/components';
import { useExchangeRateFromContext } from './ExchangeRateFormProvider';
import withDialogActions from 'containers/Dialog/withDialogActions';
import { compose } from 'utils';

function ExchangeRateFormFooter({
  // #withDialogActions
  closeDialog,
}) {
  const { isSubmitting } = useFormikContext();
  const { dialogName, action } = useExchangeRateFromContext();

  const handleClose = () => {
    closeDialog(dialogName);
  };

  return (
    <div className={Classes.DIALOG_FOOTER}>
      <div className={Classes.DIALOG_FOOTER_ACTIONS}>
        <Button onClick={handleClose}>
          <T id={'close'} />
        </Button>
        <Button intent={Intent.PRIMARY} type="submit" disabled={isSubmitting}>
          {action === 'edit' ? <T id={'edit'} /> : <T id={'submit'} />}
        </Button>
      </div>
    </div>
  );
}

export default compose(withDialogActions)(ExchangeRateFormFooter);
