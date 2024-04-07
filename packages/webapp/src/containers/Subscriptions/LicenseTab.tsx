// @ts-nocheck
import React from 'react';
import { Intent, Button } from '@blueprintjs/core';
import { useFormikContext } from 'formik';
import { FormattedMessage as T } from '@/components';
import { compose } from '@/utils';

import withDialogActions from '@/containers/Dialog/withDialogActions';

/**
 * Payment via license code tab.
 */
function LicenseTab({ openDialog }) {
  const { submitForm, values } = useFormikContext();

  const handleSubmitBtnClick = () => {
    submitForm().then(() => {
      openDialog('payment-via-voucher', { ...values });
    });
  };

  return (
    <div className={'license-container'}>
      <h3>
        <T id={'voucher'} />
      </h3>
      <p className="paragraph">
        <T id={'cards_will_be_charged'} />
      </p>

      <Button onClick={handleSubmitBtnClick} intent={Intent.PRIMARY} large={true}>
        <T id={'submit_voucher'} />
      </Button>
    </div>
  );
}

export default compose(withDialogActions)(LicenseTab);
