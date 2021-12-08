import React from 'react';
import { Callout, Intent, Classes } from '@blueprintjs/core';
import { AppToaster, T } from 'components';

export const transformErrors = (errors, { setErrors }) => {};

export function EmptyStatuCallout() {
  return (
    <div className={Classes.DIALOG_BODY}>
      <Callout intent={Intent.PRIMARY}>
        <p>
          <T id={'reconcile_vendor_credit.alert.there_is_no_open_bills'} />
        </p>
      </Callout>
    </div>
  );
}
