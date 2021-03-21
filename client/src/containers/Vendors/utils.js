import React from 'react';
import { Intent } from '@blueprintjs/core';
import { AppToaster } from 'components';
import { formatMessage } from 'services/intl';

export const transformErrors = (errors) => {
  if (errors.find((error) => error.type === 'VENDOR.HAS.ASSOCIATED.BILLS')) {
    AppToaster.show({
      message: formatMessage({
        id: 'cannot_delete_vendor_that_has_associated_purchase_bills',
      }),
      intent: Intent.DANGER,
    });
  }
};
