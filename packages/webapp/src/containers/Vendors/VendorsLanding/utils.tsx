import { Intent } from '@blueprintjs/core';
import intl from 'react-intl-universal';
import type { TableQuery } from '@/store/store.types';
import { AppToaster } from '@/components';
import { transformTableStateToQuery } from '@/utils';

type VendorBulkDeleteError = { type: string };

// Transform API errors in toasts messages.
export const transformErrors = (errors: VendorBulkDeleteError[]) => {
  if (errors.some((e) => e.type === 'VENDOR.HAS.BILLS')) {
    AppToaster.show({
      message: intl.get('vendor_has_bills'),
      intent: Intent.DANGER,
    });
  }
};

export const transformVendorsStateToQuery = (
  tableState: Partial<TableQuery> & { inactiveMode?: boolean },
) => ({
  ...transformTableStateToQuery(tableState),
  inactive_mode: tableState.inactiveMode || false,
});
