import { useEffect } from 'react';

import '@/style/pages/Vendors/List.scss';

import { VendorActionsBar } from './VendorActionsBar';
import { VendorsListDialogs } from './VendorsListDialogs';
import { VendorsListProvider } from './VendorsListProvider';
import { VendorsTable } from './VendorsTable';
import { withVendors } from './withVendors';
import type { WithVendorsProps } from './withVendors';
import { withVendorsActions } from './withVendorsActions';
import type { WithVendorsActionsProps } from './withVendorsActions';
import { DashboardPageContent } from '@/components';
import { compose } from '@/utils';

interface VendorsListInnerProps
  extends Pick<
      WithVendorsProps,
      'vendorsTableState' | 'vendorsTableStateChanged'
    >,
    WithVendorsActionsProps {}

/**
 * Vendors list page.
 */
function VendorsListInner({
  // #withVendors
  vendorsTableState,
  vendorsTableStateChanged,

  // #withVendorsActions
  resetVendorsTableState,
  resetVendorsSelectedRows,
}: VendorsListInnerProps) {
  // Resets the vendors table state once the page unmount.
  useEffect(
    () => () => {
      resetVendorsTableState();
      resetVendorsSelectedRows();
    },
    [resetVendorsSelectedRows, resetVendorsTableState],
  );

  return (
    <VendorsListProvider
      tableState={vendorsTableState}
      tableStateChanged={vendorsTableStateChanged}
    >
      <VendorActionsBar />
      <VendorsListDialogs />

      <DashboardPageContent>
        <VendorsTable />
      </DashboardPageContent>
    </VendorsListProvider>
  );
}

export const VendorsList = compose(
  withVendors(({ vendorsTableState, vendorsTableStateChanged }) => ({
    vendorsTableState,
    vendorsTableStateChanged,
  })),
  withVendorsActions,
)(VendorsListInner);
