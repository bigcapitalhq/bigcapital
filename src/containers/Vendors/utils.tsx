import React from 'react';
import { Intent } from '@blueprintjs/core';
import { AppToaster } from '@/components';
import intl from 'react-intl-universal';

export const transformErrors = (errors) => {
  if (errors.find((error) => error.type === 'VENDOR.HAS.ASSOCIATED.BILLS')) {
    AppToaster.show({
      message: intl.get('cannot_delete_vendor_that_has_associated_purchase_bills'),
      intent: Intent.DANGER,
    });
  }
  if (errors.find((error) => error.type === 'VENDOR_HAS_TRANSACTIONS')) {
    AppToaster.show({
      message: intl.get('this_vendor_cannot_be_deleted_as_it_is_associated_with_transactions'),
      intent: Intent.DANGER,
    });
  }
};
