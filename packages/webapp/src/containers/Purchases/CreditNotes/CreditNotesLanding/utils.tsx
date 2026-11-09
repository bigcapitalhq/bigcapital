import { Intent } from '@blueprintjs/core';
import intl from 'react-intl-universal';
import { AppToaster } from '@/components';

interface DeleteError {
  type: string;
}

export const handleDeleteErrors = (errors: DeleteError[]) => {
  if (
    errors.find((error) => error.type === 'VENDOR_CREDIT_HAS_APPLIED_BILLS')
  ) {
    AppToaster.show({
      message: intl.get(
        'vendor_credit.error.you_couldn_t_delete_vendor_credit_has_reconciled',
      ),
      intent: Intent.DANGER,
    });
  }
  if (
    errors.find(
      (error) => error.type === 'VENDOR_CREDIT_HAS_REFUND_TRANSACTIONS',
    )
  ) {
    AppToaster.show({
      message: intl.get(
        'vendor_credit.error.you_couldn_t_delete_vendor_credit_that_has_associated_refund',
      ),
      intent: Intent.DANGER,
    });
  }
};
