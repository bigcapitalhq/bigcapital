// @ts-nocheck
import React from 'react';
import intl from 'react-intl-universal';

import '@/style/pages/Preferences/warehousesList.scss';

import { WarehousesGrid } from './WarehousesGrid';
import { withDashboardActions } from '@/containers/Dashboard/withDashboardActions';
import { flow } from 'fp-ts/function';

/**
 * Warehouses.
 * @returns
 */
function WarehousesInner({
  // #withDashboardActions
  changePreferencesPageTitle,
}) {
  React.useEffect(() => {
    changePreferencesPageTitle(intl.get('warehouses.label'));
  }, [changePreferencesPageTitle]);

  return (
    <React.Fragment>
      <WarehousesGrid />
    </React.Fragment>
  );
}
export const Warehouses = flow(withDashboardActions)(WarehousesInner);
