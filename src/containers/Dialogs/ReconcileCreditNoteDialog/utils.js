import React from 'react';
import intl from 'react-intl-universal';
import { Callout, Intent, Classes } from '@blueprintjs/core';

import { AppToaster, T } from 'components';

export const transformErrors = (errors, { setErrors }) => {
  if (errors.some((e) => e.type === 'INVOICES_HAS_NO_REMAINING_AMOUNT')) {
    AppToaster.show({
      message: 'INVOICES_HAS_NO_REMAINING_AMOUNT',
      intent: Intent.DANGER,
    });
  }

  if (
    errors.find((error) => error.type === 'CREDIT_NOTE_HAS_NO_REMAINING_AMOUNT')
  ) {
    AppToaster.show({
      message: 'CREDIT_NOTE_HAS_NO_REMAINING_AMOUNT',
      intent: Intent.DANGER,
    });
  }
};

export function EmptyStatuCallout() {
  return (
    <div className={Classes.DIALOG_BODY}>
      <Callout intent={Intent.PRIMARY}>
        <p>
          <T id={'reconcile_credit_note.alert.there_is_no_open_sale_invoices'} />
        </p>
      </Callout>
    </div>
  );
}
