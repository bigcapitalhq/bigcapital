import { useCallback } from 'react';
import { formatMessage } from 'services/intl';
import { Intent } from '@blueprintjs/core';
import { AppToaster } from 'components';

// Transform API errors in toasts messages.
export const transformErrors = useCallback((errors) => {
  if (errors.some((e) => e.type === 'VENDOR.HAS.BILLS')) {
    AppToaster.show({
      message: formatMessage({
        id: 'vendor_has_bills',
      }),
      intent: Intent.DANGER,
    });
  }
}, []);
