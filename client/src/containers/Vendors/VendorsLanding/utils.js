import { useCallback } from 'react';
import intl from 'react-intl-universal';
import { Intent } from '@blueprintjs/core';
import { AppToaster } from 'components';

// Transform API errors in toasts messages.
export const transformErrors = useCallback((errors) => {
  if (errors.some((e) => e.type === 'VENDOR.HAS.BILLS')) {
    AppToaster.show({
      message: intl.get('vendor_has_bills'),
      intent: Intent.DANGER,
    });
  }
}, []);
