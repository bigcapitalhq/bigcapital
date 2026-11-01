import { Intent } from '@blueprintjs/core';
import intl from 'react-intl-universal';
import { AppToaster } from '@/components';

interface TransformError {
  type: string;
}

export const transformErrors = (errors: unknown) => {
  if (!Array.isArray(errors)) {
    return;
  }
  const typedErrors = errors as TransformError[];
  if (
    typedErrors.find((error) => error.type === 'VENDOR.HAS.ASSOCIATED.BILLS')
  ) {
    AppToaster.show({
      message: intl.get(
        'cannot_delete_vendor_that_has_associated_purchase_bills',
      ),
      intent: Intent.DANGER,
    });
  }
  if (typedErrors.find((error) => error.type === 'VENDOR_HAS_TRANSACTIONS')) {
    AppToaster.show({
      message: intl.get(
        'this_vendor_cannot_be_deleted_as_it_is_associated_with_transactions',
      ),
      intent: Intent.DANGER,
    });
  }
};
